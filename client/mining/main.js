/* eslint-env browser */
import io from 'socket.io-client';
import MinerController from './miner-controller';

const socket = io('http://localhost:3000');

new MinerController({socket});
