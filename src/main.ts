import {run} from '@subsquid/batch-processor'
import {augmentBlock} from '@subsquid/solana-objects'
import {DataSourceBuilder} from '@subsquid/solana-stream'
import {TypeormDatabase} from '@subsquid/typeorm-store'
import assert from 'assert'
import * as tokenProgram from './abi/token-program'
import * as whirlpool from './abi/whirlpool'
import {Instruction} from './model'

const dataSource = new DataSourceBuilder()
  .setPortal({
    url: "https://portal.sqd.dev/datasets/solana-mainnet",
    http: {
      retryAttempts: Number.POSITIVE_INFINITY,
    },
  })
  .setBlockRange({
    from: 408791576,
  })
  .setFields({
    block: {
      // block header fields
      timestamp: true,
      number: true,
    },
    transaction: {
      // transaction fields
      signatures: true,
      accountKeys: true,
    },
    instruction: {
      // instruction fields
      programId: true,
      accounts: true,
      data: true,
    },
  })
  .addInstruction({
    where: {
      programId: ['LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo'],
      isCommitted: true, // where successfully committed
    },
    include: {
      innerInstructions: true, // inner instructions
      transaction: true, // transaction, that executed the given instruction
      transactionTokenBalances: true, // all token balance records of executed transaction
      logs: true, // logs
    },
  })
  .build();

const database = new TypeormDatabase({supportHotBlocks: true})

run(dataSource, database, async ctx => {
  let blocks = ctx.blocks.map(augmentBlock)

  const insobjs = blocks.flatMap(b =>
    b.instructions.map(i =>
      new Instruction({
        id: i.id,
        block: b.header.number,
        blockHash: b.header.hash,
        signature: i.transaction!.signatures[0]
      })
    )
  )

  await ctx.store.insert(insobjs)
})
