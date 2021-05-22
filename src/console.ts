import chalk from 'chalk';

export const message = (
  m: string,
  color: keyof Pick<
    typeof chalk,
    | 'red'
    | 'yellow'
    | 'greenBright'
    | 'yellowBright'
    | 'redBright'
    | 'blueBright'
  >,
) => {
  console.log(chalk[color](m));
};
