import { Context, Schema } from 'koishi'

export const name = 'command-creater'

export const usage = "更新日志：https://forum.koishi.xyz/t/topic/6290"

export interface Command {
  name: string
  content: string
  mode: 'reply' | 'execute'
}

export const Command: Schema<Command> = Schema.object({
  name: Schema.string().description("指令名").required(),
  content: Schema.string().description("指令内容").required(),
  mode: Schema.union([
    Schema.const("reply").description("发送指令内容"),
    Schema.const("execute").description("调用指令内容")
  ]).description("触发指令后").role("radio").required()
})

export interface Config {
  commands: Command[]
}

export const Config: Schema<Config> = Schema.object({
  commands: Schema.array(Command),
})

export function apply(ctx: Context, config: Config) {
  for (const command of config.commands) {
    ctx.command(`${command.name} [parameter:text]`)
      .action(async ({session}, parameter) => {
        switch (command.mode) {
          case 'reply':
            await session.send(command.content)
            break
          case 'execute':
            await session.execute(`${command.content} ${parameter ?? ""}`)
            break
        }
      })
    
  }
}
