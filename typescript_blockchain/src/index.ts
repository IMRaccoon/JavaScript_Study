import * as CryptoJS from 'crypto-js';

class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  static calculateBlockHash = ({
    index,
    previousHash,
    timestamp,
    data,
  }: {
    index: number;
    previousHash: string;
    timestamp: number;
    data: string;
  }): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.data === 'string' &&
    typeof aBlock.index === 'number' &&
    typeof aBlock.hash === 'string' &&
    typeof aBlock.previousHash === 'string';

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number,
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, '20202020', '', 'hello', 123456);

let blockchain: Block[] = [genesisBlock];

const getBlockChain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimestamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const nextTimestamp: number = getNewTimestamp();
  const nextHash: string = Block.calculateBlockHash({
    index: newIndex,
    previousHash: previousBlock.hash,
    timestamp: nextTimestamp,
    data,
  });
  const newBlock: Block = new Block(
    newIndex,
    nextHash,
    previousBlock.hash,
    data,
    nextTimestamp,
  );
  addBlock(newBlock);
  return newBlock;
};

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (
    candidateBlock.hash !== Block.calculateBlockHash({ ...candidateBlock })
  ) {
    return false;
  }
  return true;
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
  }
};

createNewBlock('secondBlock');
createNewBlock('thirdBlock');
createNewBlock('forthBlock');
createNewBlock('fifthBlock');

console.log(blockchain);
