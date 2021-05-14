#!/usr/bin/env node

const { program } = require("commander");
const LogCore = require("log-core");

program.action((cmd) => LogCore());

program.parse(program.args);
