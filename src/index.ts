#!/usr/bin/env node
import { ConfigFile, GLOBAL_CONFIG_FILE } from './config';
export const getInitialConfig = ({
  graphql,
  mode,
}: Pick<ConfigFile, 'graphql' | 'mode'>): ConfigFile => {
  return {
    ...GLOBAL_CONFIG_FILE,
    graphql,
    mode,
  };
};
