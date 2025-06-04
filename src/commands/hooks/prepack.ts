import { Command } from '@oclif/core';
import chalk from 'chalk';
import { join } from 'path';
import { which, exec } from 'shelljs';
import { ERR_MVN_NOT_FOUND } from '../../errors';
import {glob} from 'glob';
import { isWindows } from '../../lib';

export default class HooksPrePack extends Command {
  static override hidden = true;

  static override description = `Hooks script to run before jpm package is packed
    Currently, it perform a lookup to ${chalk.bold(
      'pom.xml'
    )} in the working directory. If found, runs ${chalk.bold(
    'mvn package'
  )} before continue.`;

  static override examples = ['jpm hooks prepack'];

  public async run(): Promise<void> {
    const matches :  string[] = await glob(join(process.cwd(), 'pom.xml'), {windowsPathsNoEscape: isWindows()});

    for (const match of matches) {
      this.log(
        `found ${chalk.bold(match)} executing ${chalk.bold(
          'mvn package -f ' + match
        )}  `
      );
      if (!which('mvn')) {
        throw ERR_MVN_NOT_FOUND;
      }
      if (exec('mvn package -f ' + match).code !== 0) {
        throw new Error('Error: mvn package failed');
      }
    }
  }
}
