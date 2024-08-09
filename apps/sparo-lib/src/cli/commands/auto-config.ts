import { Argv } from 'yargs';
import { Command } from '../../decorator';
import { inject } from 'inversify';
import { GitService } from '../../services/GitService';
import type { ArgumentsCamelCase } from 'yargs';
import type { TerminalService } from '../../services/TerminalService';
import type { ICommand } from './base';
import type { GitRepoInfo } from 'git-repo-info';

export interface IAutoConfigCommandOptions {
  overwrite?: boolean;
  dryRun?: boolean;
}

@Command()
export class AutoConfigCommand implements ICommand<IAutoConfigCommandOptions> {
  public cmd: string = 'auto-config';
  public description: string = 'Automatic setup optimized git config';
  @inject(GitService) private _gitService!: GitService;

  public builder(yargs: Argv<IAutoConfigCommandOptions>): void {
    yargs
      .option('overwrite', {
        type: 'boolean',
        default: false
      })
      .option('dryRun', {
        type: 'boolean',
        hidden: true,
        default: false
      })
      .completion('completion', false, (current, argv, done) => {
        const longParameters: string[] = [argv.overwrite ? '' : '--overwrite'].filter(Boolean);
        if (current.startsWith('--')) {
          done(
            longParameters.filter((parameter) => {
              return parameter.startsWith(current);
            })
          );
        } else {
          done([]);
        }
      });
  }
  public handler = async (
    args: ArgumentsCamelCase<IAutoConfigCommandOptions>,
    terminalService: TerminalService
  ): Promise<void> => {
    const { _gitService: gitService } = this;
    const { overwrite = false, dryRun = false } = args;

    const repoInfo: GitRepoInfo = gitService.getRepoInfo();
    if (!repoInfo.root) {
      throw new Error('Please run auto-config command inside a git repository.');
    }

    terminalService.terminal.writeDebugLine(`git args for auto-config command: ${JSON.stringify(args)}`);
    try {
      gitService.setRecommendConfig({ overwrite, dryRun });
    } catch (e: unknown) {
      if ((e as Error)?.message?.includes('already exist')) {
        terminalService.terminal.writeLine('Add option --overwrite to overwrite existing config.');
      }
      throw e;
    }
  };
}
