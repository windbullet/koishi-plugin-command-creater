import { Context, Schema } from 'koishi'

export const name = 'command-creater'

export interface Command {
  name: string
  cmdAlias: string[]
  cmdDescription: string
  reply: string
}

export const Command: Schema<Command> = Schema.object({
  name: Schema.string().description("指令名").required(),
  cmdAlias: Schema.array(Schema.string()).description("指令别名 (可选项)"),
  cmdDescription: Schema.string().description("指令说明 (可选项)"),
  reply: Schema.string().description("指令的回复").required(),
})

export interface Config {
  commands: Command[]
}

export const Config: Schema<Config> = Schema.object({
  commands: Schema.array(Command),
})

export function apply(ctx: Context, config: Config) {
  for (const command of config.commands) {
    ctx.command(command.name, command.cmdDescription ? command.cmdDescription : '')
      .action(({session}) => {
        session.send(command.reply)
      })
    
    for (const cmdAlias of command.cmdAlias) {
      ctx.command(command.name).alias(cmdAlias)
    }
  }
}
