import * as io from 'socket.io-client';
import ping from 'web-ping';
import { EventEmitter } from 'events';
import ServerAddress from '../models/ServerAddress';
const {GAME_WEBSOCKET_SERVERS} = require('../credentials.json');

export default class SocketServerService extends EventEmitter {
  public socket: SocketIOClient.Socket;

  constructor() {
    super()
    this.getBestServer()
      .then(server => {
        this.socket = io(`${server.protocol}://${server.host}:${server.port}`, {
          path: server.path
        })
        this.socket.once('connect', () => this.emit('connect'));
      })
  }

  private async getBestServer(): Promise<ServerAddress> {
    const pings = await this.pingAllServers()
    let lowestLatencyServer = null;
    let lowestLatency = Number.MAX_SAFE_INTEGER;
    pings.forEach((latency, server) => {
      if (latency < lowestLatency) {
        lowestLatency = latency;
        lowestLatencyServer = server;
      }
    }, null);
    return lowestLatencyServer;
  }

  private async pingAllServers(): Promise<Map<ServerAddress, number>> {
    const pingPromises: Array<number> = GAME_WEBSOCKET_SERVERS.map(
      server => ping(`${server.pingProtocol}://${server.host}:${server.port}/ping`))
    const latencies: Array<number> = await Promise.all(pingPromises)
    const pings: Map<ServerAddress, number> = GAME_WEBSOCKET_SERVERS.reduce(
      (result, server, i) => result.set(server, latencies[i]), new Map())
    return pings;
  }
}
