![npm](https://img.shields.io/npm/v/flex-plugins-utils-logger.svg?style=square)
![npm](https://img.shields.io/npm/dt/flex-plugins-utils-logger.svg?style=square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugins-utils-logger.svg?style=square)](../../LICENSE)

# Flex Plugin Utils Logger

General logger methods used by various Flex Plugins repos

## Modules

This library provides the following modules

### logger

The `logger` provides the following methods:

* `debug`           Only logs if `DEBUG=true` or `TRACE=true` is set
* `info`            Logs the text as info level
* `warning`         Logs the text as warning level in yellow
* `error`           Logs the text as error level in red
* `trace`           Only logs if `TRACE=true` is set; this is the most verbose mode
* `success`         Logs the text in info level in green
* `newline`         Adds a new line
* `notice`          Logs the text as info level in cyan
* `clearTerminal`   Clears the terminal window if `PERSIST_TERMINAL=true` is not set

All of these log commands support some basic formatting:

**bold**

Texts can be bolded using `**the text to bold**`.

**italic**

Texts can be italicized using `*the text to italicize*`.

**success**

Texts can be shown in green using `++the text in green++`.

**warning**

Texts can be shown in yellow using `!!the text in yellow!!`.

**error**

Texts can be shown in red using `--the text in red--`.

**link**

Texts can be shown in cyan using `[[the text in cyan]]`.

**info**

Texts can be shown in blue using `@@the text in blue@@`.

**code**

Texts can be shown in magenta using `{{the text in magenta}}`.

**dim**

Texts can be shown in dim using `..the dim text..`

### Inquirer

This package provides 3 main methods:

#### const prompt = async (question: Question): Promise<Question['name']>

Prompts the user to answer the question. Upon validation, returns the answer. `Question` interface is defined as

```typescript
export interface Question {
  name: string;
  message: string;
  type?: 'list' | 'input' | 'password';
  validate?(input: string): boolean | string | Promise<boolean | string>;
}
```

#### const confirm = async (question: string, defaultAnswer?: YNAnswer): Promise<boolean>

Provides a confirmation prompt. The response is a Promise<boolean> with `true` resolving to successful confirmation, and `false` being the rejected confirmation. The `YNAnswer` is `'Y' | 'N'`.

#### const choose = async (question: Question, choices: string[]): Promise<Question['name']>;

Prompts the user to select from one of the choices.


