console.log('我是第几个执行的:这里是--->rollup.config.js')

import path from 'path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}
// 3.0.0-beta.12
const masterVersion = require('./package.json').version
// C:\Users\lebron\Desktop\vue-next\packages
const packagesDir = path.resolve(__dirname, 'packages')
// C:\Users\lebron\Desktop\vue-next\packages\vue
const packageDir = path.resolve(packagesDir, process.env.TARGET)
// vue
const name = path.basename(packageDir)
// resolve [Function: resolve]
const resolve = p => path.resolve(packageDir, p)
/*
 {
  "name": "vue",
  "version": "3.0.0-beta.12",
  "description": "vue",
  "main": "index.js",
  "module": "dist/vue.runtime.esm-bundler.js",
  "types": "dist/vue.d.ts",
  "unpkg": "dist/vue.global.js",
  "jsdelivr": "dist/vue.global.js",
  "sideEffects": false,
  "files": [
    "index.js",
    "dist"
  ],
  "buildOptions": {
    "name": "Vue",
    "formats": [
      "esm-bundler",
      "esm-bundler-runtime",
      "cjs",
      "global",
      "global-runtime",
      "esm-browser",
      "esm-browser-runtime"
    ]
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vuejs/vue-next.git"
  },
  "keywords": [
    "vue"
  ],
  "author": "Evan You",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/vuejs/vue-next/issues"
  },
  "homepage": "https://github.com/vuejs/vue-next/tree/master/packages/vue#readme",
  "dependencies": {
    "@vue/shared": "3.0.0-beta.12",
    "@vue/compiler-dom": "3.0.0-beta.12",
    "@vue/runtime-dom": "3.0.0-beta.12"
  },
  "devDependencies": {
    "lodash": "^4.17.15",
    "marked": "^0.7.0",
    "todomvc-app-css": "^2.3.0"
  }
}

*/
const pkg = require(resolve(`package.json`))
/*
 {
  name: 'Vue',
  formats: [
    'esm-bundler',
    'esm-bundler-runtime',
    'cjs',
    'global',
    'global-runtime',
    'esm-browser',
    'esm-browser-runtime'
  ]
}
*/
const packageOptions = pkg.buildOptions || {}

// ensure TS checks only once for each build
let hasTSChecked = false
// 打包输出配置
const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  },

  // runtime-only builds, for main "vue" package only
  'esm-bundler-runtime': {
    file: resolve(`dist/${name}.runtime.esm-bundler.js`),
    format: `es`
  },
  'esm-browser-runtime': {
    file: resolve(`dist/${name}.runtime.esm-browser.js`),
    format: 'es'
  },
  'global-runtime': {
    file: resolve(`dist/${name}.runtime.global.js`),
    format: 'iife'
  }
}
// console.log(process.env)
/*
{
  ACLOCAL_PATH: 'C:\\Program Files\\Git\\mingw64\\share\\aclocal;C:\\Program Files\\Git\\usr\\share\\aclocal',
  ALLUSERSPROFILE: 'C:\\ProgramData',
  APPDATA: 'C:\\Users\\lebron\\AppData\\Roaming',
  APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL: 'true',
  COLORTERM: 'truecolor',
  COMMIT: '15696ce',
  COMMONPROGRAMFILES: 'C:\\Program Files\\Common Files',
  'CommonProgramFiles(x86)': 'C:\\Program Files (x86)\\Common Files',
  CommonProgramW6432: 'C:\\Program Files\\Common Files',
  COMPUTERNAME: 'DESKTOP-4MVJ3HL',
  COMSPEC: 'C:\\WINDOWS\\system32\\cmd.exe',
  configsetroot: 'C:\\WINDOWS\\ConfigSetRoot',
  CONFIG_SITE: 'C:/Program Files/Git/mingw64/etc/config.site',
  DISPLAY: 'needs-to-be-defined',
  DriverData: 'C:\\Windows\\System32\\Drivers\\DriverData',
  EXEPATH: 'C:\\Program Files\\Git',
  FORMATS: 'global',
  FPS_BROWSER_APP_PROFILE_STRING: 'Internet Explorer',
  FPS_BROWSER_USER_PROFILE_STRING: 'Default',
  GIT_ASKPASS: 'd:\\app\\vscode\\Microsoft VS Code\\resources\\app\\extensions\\git\\dist\\askpass.sh',
  HOME: 'C:\\Users\\lebron',
  HOMEDRIVE: 'C:',
  HOMEPATH: '\\Users\\lebron',
  HOSTNAME: 'DESKTOP-4MVJ3HL',
  INFOPATH: 'C:\\Program Files\\Git\\usr\\local\\info;C:\\Program Files\\Git\\usr\\share\\info;C:\\Program Files\\Git\\usr\\info;C:\\Program Files\\Git\\share\\info',
  INIT_CWD: 'C:\\Users\\lebron\\Desktop\\vue-next',
  LANG: 'zh_CN.UTF-8',
  LOCALAPPDATA: 'C:\\Users\\lebron\\AppData\\Local',
  LOGONSERVER: '\\\\DESKTOP-4MVJ3HL',
  MANPATH: 'C:\\Program Files\\Git\\mingw64\\local\\man;C:\\Program Files\\Git\\mingw64\\share\\man;C:\\Program Files\\Git\\usr\\local\\man;C:\\Program Files\\Git\\usr\\share\\man;C:\\Program Files\\Git\\usr\\man;C:\\Program Files\\Git\\share\\man',
  MINGW_CHOST: 'x86_64-w64-mingw32',
  MINGW_PACKAGE_PREFIX: 'mingw-w64-x86_64',
  MINGW_PREFIX: 'C:/Program Files/Git/mingw64',
  MSYSTEM: 'MINGW64',
  MSYSTEM_CARCH: 'x86_64',
  MSYSTEM_CHOST: 'x86_64-w64-mingw32',
  MSYSTEM_PREFIX: 'C:/Program Files/Git/mingw64',
  NODE: 'C:\\Program Files\\nodejs\\node.exe',
  NODE_EXE: 'C:\\Program Files\\nodejs\\\\node.exe',
  NPM_CLI_JS: 'C:\\Program Files\\nodejs\\\\node_modules\\npm\\bin\\npm-cli.js',
  npm_config_access: '',
  npm_config_allow_same_version: '',
  npm_config_also: '',
  npm_config_always_auth: '',
  npm_config_argv: '{"remain":[],"cooked":["run","dev"],"original":["run","dev"]}',
  npm_config_audit: 'true',
  npm_config_audit_level: 'low',
  npm_config_auth_type: 'legacy',
  npm_config_before: '',
  npm_config_bin_links: 'true',
  npm_config_browser: '',
  npm_config_ca: '',
  npm_config_cache: 'C:\\Users\\lebron\\AppData\\Roaming\\npm-cache',
  npm_config_cache_lock_retries: '10',
  npm_config_cache_lock_stale: '60000',
  npm_config_cache_lock_wait: '10000',
  npm_config_cache_max: 'Infinity',
  npm_config_cache_min: '10',
  npm_config_cafile: '',
  npm_config_cert: '',
  npm_config_cidr: '',
  npm_config_color: 'true',
  npm_config_commit_hooks: 'true',
  npm_config_depth: 'Infinity',
  npm_config_description: 'true',
  npm_config_dev: '',
  npm_config_dry_run: '',
  npm_config_editor: 'notepad.exe',
  npm_config_engine_strict: '',
  npm_config_fetch_retries: '2',
  npm_config_fetch_retry_factor: '10',
  npm_config_fetch_retry_maxtimeout: '60000',
  npm_config_fetch_retry_mintimeout: '10000',
  npm_config_force: '',
  npm_config_git: 'git',
  npm_config_git_tag_version: 'true',
  npm_config_global: '',
  npm_config_globalconfig: 'C:\\Users\\lebron\\AppData\\Roaming\\npm\\etc\\npmrc',
  npm_config_globalignorefile: 'C:\\Users\\lebron\\AppData\\Roaming\\npm\\etc\\npmignore',
  npm_config_global_style: '',
  npm_config_group: '',
  npm_config_ham_it_up: '',
  npm_config_heading: 'npm',
  npm_config_home: 'https://npm.taobao.org',
  npm_config_https_proxy: '',
  npm_config_if_present: '',
  npm_config_ignore_prepublish: '',
  npm_config_ignore_scripts: '',
  npm_config_init_author_email: '',
  npm_config_init_author_name: '',
  npm_config_init_author_url: '',
  npm_config_init_license: 'ISC',
  npm_config_init_module: 'C:\\Users\\lebron\\.npm-init.js',
  npm_config_init_version: '1.0.0',
  npm_config_json: '',
  npm_config_key: '',
  npm_config_legacy_bundling: '',
  npm_config_link: '',
  npm_config_local_address: '',
  npm_config_loglevel: 'notice',
  npm_config_logs_max: '10',
  npm_config_long: '',
  npm_config_maxsockets: '50',
  npm_config_message: '%s',
  npm_config_metrics_registry: 'https://registry.npm.taobao.org/',
  npm_config_node_gyp: 'C:\\Program Files\\nodejs\\node_modules\\npm\\node_modules\\node-gyp\\bin\\node-gyp.js',
  npm_config_node_options: '',
  npm_config_node_version: '12.10.0',
  npm_config_noproxy: '',
  npm_config_offline: '',
  npm_config_onload_script: '',
  npm_config_only: '',
  npm_config_optional: 'true',
  npm_config_otp: '',
  npm_config_package_lock: 'true',
  npm_config_package_lock_only: '',
  npm_config_parseable: '',
  npm_config_prefer_offline: '',
  npm_config_prefer_online: '',
  npm_config_prefix: 'C:\\Users\\lebron\\AppData\\Roaming\\npm',
  npm_config_preid: '',
  npm_config_production: '',
  npm_config_progress: 'true',
  npm_config_proxy: '',
  npm_config_read_only: '',
  npm_config_rebuild_bundle: 'true',
  npm_config_registry: 'https://registry.npm.taobao.org/',
  npm_config_rollback: 'true',
  npm_config_save: 'true',
  npm_config_save_bundle: '',
  npm_config_save_dev: '',
  npm_config_save_exact: '',
  npm_config_save_optional: '',
  npm_config_save_prefix: '^',
  npm_config_save_prod: '',
  npm_config_scope: '',
  npm_config_scripts_prepend_node_path: 'warn-only',
  npm_config_script_shell: '',
  npm_config_searchexclude: '',
  npm_config_searchlimit: '20',
  npm_config_searchopts: '',
  npm_config_searchstaleness: '900',
  npm_config_send_metrics: '',
  npm_config_shell: 'C:\\WINDOWS\\system32\\cmd.exe',
  npm_config_shrinkwrap: 'true',
  npm_config_sign_git_commit: '',
  npm_config_sign_git_tag: '',
  npm_config_sso_poll_frequency: '500',
  npm_config_sso_type: 'oauth',
  npm_config_strict_ssl: 'true',
  npm_config_tag: 'latest',
  npm_config_tag_version_prefix: 'v',
  npm_config_timing: '',
  npm_config_tmp: 'C:\\Users\\lebron\\AppData\\Local\\Temp',
  npm_config_umask: '0000',
  npm_config_unicode: '',
  npm_config_unsafe_perm: 'true',
  npm_config_update_notifier: 'true',
  npm_config_usage: '',
  npm_config_user: '',
  npm_config_userconfig: 'C:\\Users\\lebron\\.npmrc',
  npm_config_user_agent: 'npm/6.10.3 node/v12.10.0 win32 x64',
  npm_config_version: '',
  npm_config_versions: '',
  npm_config_viewer: 'browser',
  npm_execpath: 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
  npm_lifecycle_event: 'dev',
  npm_lifecycle_script: 'node scripts/dev.js',
  npm_node_execpath: 'C:\\Program Files\\nodejs\\node.exe',
  npm_package_description: '- All planned RFCs have been merged.',
  npm_package_devDependencies_brotli: '^1.3.2',
  npm_package_devDependencies_chalk: '^2.4.2',
  npm_package_devDependencies_conventional_changelog_cli: '^2.0.31',
  npm_package_devDependencies_csstype: '^2.6.8',
  npm_package_devDependencies_enquirer: '^2.3.2',
  npm_package_devDependencies_execa: '^2.0.4',
  npm_package_devDependencies_fs_extra: '^8.1.0',
  npm_package_devDependencies_jest: '^25.2.3',
  npm_package_devDependencies_lint_staged: '^9.2.3',
  npm_package_devDependencies_minimist: '^1.2.0',
  npm_package_devDependencies_npm_run_all: '^4.1.5',
  npm_package_devDependencies_prettier: '~1.14.0',
  npm_package_devDependencies_puppeteer: '^2.0.0',
  npm_package_devDependencies_rollup: '^2.2.0',
  npm_package_devDependencies_rollup_plugin_node_builtins: '^2.1.2',
  npm_package_devDependencies_rollup_plugin_node_globals: '^1.4.0',
  npm_package_devDependencies_rollup_plugin_terser: '^5.3.0',
  npm_package_devDependencies_rollup_plugin_typescript2: '^0.27.0',
  npm_package_devDependencies_semver: '^6.3.0',
  npm_package_devDependencies_serve: '^11.3.0',
  npm_package_devDependencies_tsd: '^0.11.0',
  npm_package_devDependencies_ts_jest: '^25.2.1',
  npm_package_devDependencies_typescript: '^3.8.3',
  npm_package_devDependencies_yorkie: '^2.0.0',
  npm_package_devDependencies__ls_lint_ls_lint: '^1.8.0',
  npm_package_devDependencies__microsoft_api_extractor: '^7.3.9',
  npm_package_devDependencies__rollup_plugin_commonjs: '^11.0.2',
  npm_package_devDependencies__rollup_plugin_json: '^4.0.0',
  npm_package_devDependencies__rollup_plugin_node_resolve: '^7.1.1',
  npm_package_devDependencies__rollup_plugin_replace: '^2.2.1',
  npm_package_devDependencies__types_jest: '^25.1.4',
  npm_package_devDependencies__types_node: '13.11.1',
  npm_package_devDependencies__types_puppeteer: '^2.0.0',
  npm_package_engines_node: '>=10.0.0',
  npm_package_gitHead: '15696ce9aea5c1a5bfd0bd7f76528590e7c73cd0',
  npm_package_gitHooks_commit_msg: 'node scripts/verifyCommit.js',
  npm_package_gitHooks_pre_commit: 'ls-lint && lint-staged',
  npm_package_lint_staged___js_0: 'prettier --write',
  npm_package_lint_staged___js_1: 'git add',
  npm_package_lint_staged___ts__x__0: 'prettier --parser=typescript --write',
  npm_package_lint_staged___ts__x__1: 'git add',
  npm_package_name: '',
  npm_package_private: 'true',
  npm_package_readmeFilename: 'README.md',
  npm_package_scripts_build: 'node scripts/build.js',
  npm_package_scripts_changelog: 'conventional-changelog -p angular -i CHANGELOG.md -s',
  npm_package_scripts_dev: 'node scripts/dev.js',
  npm_package_scripts_dev_compiler: 'npm-run-all --parallel "dev template-explorer" serve',
  npm_package_scripts_lint: 'prettier --write --parser typescript "packages\**\*.ts?(x)"', 正常的是/  暂时改为 \  与注释冲突
  npm_package_scripts_ls_lint: 'ls-lint',
  npm_package_scripts_open: 'open http://localhost:5000/packages/template-explorer/local.html',
  npm_package_scripts_release: 'node scripts/release.js',
  npm_package_scripts_serve: 'serve',
  npm_package_scripts_size: 'node scripts/build.js vue runtime-dom size-check -p -f global',
  npm_package_scripts_test: 'node scripts/build.js vue -f global -d && jest',
  npm_package_scripts_test_dts: 'node scripts/build.js shared reactivity runtime-core runtime-dom -dt -f esm-bundler && tsd',
  npm_package_tsd_directory: 'test-dts',
  npm_package_types: 'test-dts/index.d.ts',
  npm_package_version: '3.0.0-beta.12',
  npm_package_workspaces_0: 'packages/*',
  NPM_PREFIX_NPM_CLI_JS: 'C:\\Users\\lebron\\AppData\\Roaming\\npm\\node_modules\\npm\\bin\\npm-cli.js',
  NUMBER_OF_PROCESSORS: '6',
  OneDrive: 'C:\\Users\\lebron\\OneDrive',
  OneDriveConsumer: 'C:\\Users\\lebron\\OneDrive',
  ORIGINAL_PATH: 'C:\\Program Files\\Git\\mingw64\\bin;C:\\Program Files\\Git\\usr\\bin;C:\\Users\\lebron\\bin;C:\\Program Files (x86)\\Common Files\\Oracle\\Java\\javapath;C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0;C:\\Windows\\System32\\OpenSSH;C:\\Program Files (x86)\\NVIDIA Corporation\\PhysX\\Common;C:\\Program Files\\NVIDIA Corporation\\NVIDIA NvDLISR;C:\\Program Files\\Intel\\WiFi\\bin;C:\\Program Files\\Common Files\\Intel\\WirelessCommon;C:\\Program Files\\nodejs;C:\\Program 
Files\\Git\\cmd;C:\\WINDOWS\\system32;C:\\WINDOWS;C:\\WINDOWS\\System32\\Wbem;C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0;C:\\WINDOWS\\System32\\OpenSSH;C:\\Users\\lebron\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Users\\lebron\\AppData\\Roaming\\npm;D:\\app\\vscode\\Microsoft VS Code\\bin;D:\\app\\Flutter\\flutter\\bin',
  ORIGINAL_TEMP: 'C:/Users/lebron/AppData/Local/Temp',
  ORIGINAL_TMP: 'C:/Users/lebron/AppData/Local/Temp',
  OS: 'Windows_NT',
  PATH: 'C:\\Program Files\\nodejs\\node_modules\\npm\\node_modules\\npm-lifecycle\\node-gyp-bin;C:\\Users\\lebron\\Desktop\\vue-next\\node_modules\\.bin;C:\\Users\\lebron\\bin;C:\\Program Files\\Git\\mingw64\\bin;C:\\Program Files\\Git\\usr\\local\\bin;C:\\Program Files\\Git\\usr\\bin;C:\\Program Files\\Git\\usr\\bin;C:\\Program Files\\Git\\mingw64\\bin;C:\\Program Files\\Git\\usr\\bin;C:\\Users\\lebron\\bin;C:\\Program Files (x86)\\Common Files\\Oracle\\Java\\javapath;C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0;C:\\Windows\\System32\\OpenSSH;C:\\Program Files (x86)\\NVIDIA Corporation\\PhysX\\Common;C:\\Program Files\\NVIDIA Corporation\\NVIDIA NvDLISR;C:\\Program 
Files\\Intel\\WiFi\\bin;C:\\Program Files\\Common Files\\Intel\\WirelessCommon;C:\\Program Files\\nodejs;C:\\Program Files\\Git\\cmd;C:\\WINDOWS\\system32;C:\\WINDOWS;C:\\WINDOWS\\System32\\Wbem;C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0;C:\\WINDOWS\\System32\\OpenSSH;C:\\Users\\lebron\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Users\\lebron\\AppData\\Roaming\\npm;D:\\app\\vscode\\Microsoft VS Code\\bin;D:\\app\\Flutter\\flutter\\bin;C:\\Program Files\\Git\\usr\\bin\\vendor_perl;C:\\Program Files\\Git\\usr\\bin\\core_perl',
  Path: 'C:\\Program Files\\nodejs\\node_modules\\npm\\node_modules\\npm-lifecycle\\node-gyp-bin;C:\\Users\\lebron\\Desktop\\vue-next\\node_modules\\.bin;C:\\Users\\lebron\\bin;C:\\Program Files\\Git\\mingw64\\bin;C:\\Program Files\\Git\\usr\\local\\bin;C:\\Program Files\\Git\\usr\\bin;C:\\Program Files\\Git\\usr\\bin;C:\\Program Files\\Git\\mingw64\\bin;C:\\Program Files\\Git\\usr\\bin;C:\\Users\\lebron\\bin;C:\\Program Files (x86)\\Common Files\\Oracle\\Java\\javapath;C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0;C:\\Windows\\System32\\OpenSSH;C:\\Program Files (x86)\\NVIDIA Corporation\\PhysX\\Common;C:\\Program Files\\NVIDIA Corporation\\NVIDIA NvDLISR;C:\\Program 
Files\\Intel\\WiFi\\bin;C:\\Program Files\\Common Files\\Intel\\WirelessCommon;C:\\Program Files\\nodejs;C:\\Program Files\\Git\\cmd;C:\\WINDOWS\\system32;C:\\WINDOWS;C:\\WINDOWS\\System32\\Wbem;C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0;C:\\WINDOWS\\System32\\OpenSSH;C:\\Users\\lebron\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Users\\lebron\\AppData\\Roaming\\npm;D:\\app\\vscode\\Microsoft VS Code\\bin;D:\\app\\Flutter\\flutter\\bin;C:\\Program Files\\Git\\usr\\bin\\vendor_perl;C:\\Program Files\\Git\\usr\\bin\\core_perl',
  PATHEXT: '.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JSE;.WSF;.WSH;.MSC',
  PKG_CONFIG_PATH: 'C:\\Program Files\\Git\\mingw64\\lib\\pkgconfig;C:\\Program Files\\Git\\mingw64\\share\\pkgconfig',
  PLINK_PROTOCOL: 'ssh',
  PROCESSOR_ARCHITECTURE: 'AMD64',
  PROCESSOR_IDENTIFIER: 'Intel64 Family 6 Model 158 Stepping 10, GenuineIntel',
  PROCESSOR_LEVEL: '6',
  PROCESSOR_REVISION: '9e0a',
  ProgramData: 'C:\\ProgramData',
  PROGRAMFILES: 'C:\\Program Files',
  'ProgramFiles(x86)': 'C:\\Program Files (x86)',
  ProgramW6432: 'C:\\Program Files',
  PROMPT: '$P$G',
  PSModulePath: 'C:\\Program Files\\WindowsPowerShell\\Modules;C:\\WINDOWS\\system32\\WindowsPowerShell\\v1.0\\Modules',
  PUBLIC: 'C:\\Users\\Public',
  PWD: 'C:/Users/lebron/Desktop/vue-next',
  ROLLUP_WATCH: 'true',
  SESSIONNAME: 'Console',
  SHELL: 'C:\\Program Files\\Git\\usr\\bin\\bash.exe',
  SHLVL: '2',
  SSH_ASKPASS: 'C:/Program Files/Git/mingw64/libexec/git-core/git-gui--askpass',
  SYSTEMDRIVE: 'C:',
  SYSTEMROOT: 'C:\\WINDOWS',
  TARGET: 'vue',
  TEMP: 'C:\\Users\\lebron\\AppData\\Local\\Temp',
  TERM: 'xterm',
  TERM_PROGRAM: 'vscode',
  TERM_PROGRAM_VERSION: '1.45.0',
  TMP: 'C:\\Users\\lebron\\AppData\\Local\\Temp',
  TMPDIR: 'C:\\Users\\lebron\\AppData\\Local\\Temp',
  USERDOMAIN: 'DESKTOP-4MVJ3HL',
  USERDOMAIN_ROAMINGPROFILE: 'DESKTOP-4MVJ3HL',
  USERNAME: 'lebron',
  USERPROFILE: 'C:\\Users\\lebron',
  VSCODE_GIT_ASKPASS_MAIN: 'd:\\app\\vscode\\Microsoft VS Code\\resources\\app\\extensions\\git\\dist\\askpass-main.js',
  VSCODE_GIT_ASKPASS_NODE: 'D:\\app\\vscode\\Microsoft VS Code\\Code.exe',
  VSCODE_GIT_IPC_HANDLE: '\\\\.\\pipe\\vscode-git-39879c1952-sock',
  WINDIR: 'C:\\WINDOWS',
  _: 'D:/app/vscode/Microsoft VS Code/Code.exe'
}
*/
const defaultFormats = ['esm-bundler', 'cjs']
// [ 'global' ]
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
// console.log('process.env.FORMATS',process.env.FORMATS)
// [ 'global' ]
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats // defaultFormats [ 'esm-bundler', 'cjs' ]
const packageConfigs = process.env.PROD_ONLY // process.env.PROD_ONLY === undefined
  ? []
  : packageFormats.map(format => createConfig(format, outputConfigs[format])) // format = global
// outputConfigs[format] = {
// file: resolve(`dist/${name}.global.js`),
// format: `iife`
// },
/*
packageConfigs 最后为
  [
{
  input: 'C:\\Users\\lebron\\Desktop\\vue-next\\packages\\vue\\src\\index.ts',
  external: [ 'source-map', '@babel/parser', 'estree-walker' ],
  plugins: [ [Object], [Object], [Object] ],
  output: {
    file: 'C:\\Users\\lebron\\Desktop\\vue-next\\packages\\vue\\dist\\vue.global.js',
    format: 'iife',
    sourcemap: false,
    externalLiveBindings: false,
    name: 'Vue',
    globals: [Object]
  },
  onwarn: [Function: onwarn],
  treeshake: { moduleSideEffects: false }
}
]
*/
//  生产环境 添加配置
if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach(format => {
    if (packageOptions.prod === false) {
      return
    }
    if (format === 'cjs') {
      packageConfigs.push(createProductionConfig(format))
    }
    if (/^(global|esm-browser)(-runtime)?/.test(format)) {
      packageConfigs.push(createMinifiedConfig(format))
    }
  })
}
console.log('export default前')
export default packageConfigs
console.log('export default后')

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  output.sourcemap = !!process.env.SOURCE_MAP
  output.externalLiveBindings = false

  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)
  const isBundlerESMBuild = /esm-bundler/.test(format)
  const isBrowserESMBuild = /esm-browser/.test(format)
  const isNodeBuild = format === 'cjs'
  const isGlobalBuild = /global/.test(format)

  if (isGlobalBuild) {
    output.name = packageOptions.name
  }

  const shouldEmitDeclarations = process.env.TYPES != null && !hasTSChecked

  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations
      },
      exclude: ['**/__tests__', 'test-dts']
    }
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const entryFile = /runtime$/.test(format) ? `src/runtime.ts` : `src/index.ts`

  const external =
    isGlobalBuild || isBrowserESMBuild
      ? packageOptions.enableNonBrowserBranches
        ? // externalize postcss for @vue/compiler-sfc
        // because @rollup/plugin-commonjs cannot bundle it properly
        ['postcss']
        : // normal browser builds - non-browser only imports are tree-shaken,
        // they are only listed here to suppress warnings.
        ['source-map', '@babel/parser', 'estree-walker']
      : // Node / esm-bundler builds. Externalize everything.
      [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        ...['path', 'url'] // for @vue/compiler-sfc
      ]

  // the browser builds of @vue/compiler-sfc requires postcss to be available
  // as a global (e.g. http://wzrd.in/standalone/postcss)
  output.globals = {
    postcss: 'postcss'
  }

  const nodePlugins =
    packageOptions.enableNonBrowserBranches && format !== 'cjs'
      ? [
        require('@rollup/plugin-node-resolve')({
          preferBuiltins: true
        }),
        require('@rollup/plugin-commonjs')({
          sourceMap: false
        }),
        require('rollup-plugin-node-builtins')(),
        require('rollup-plugin-node-globals')()
      ]
      : []

  return {
    input: resolve(entryFile),
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external,
    plugins: [
      json({
        namedExports: false
      }),
      tsPlugin,
      createReplacePlugin(
        isProductionBuild,
        isBundlerESMBuild,
        isBrowserESMBuild,
        // isBrowserBuild?
        (isGlobalBuild || isBrowserESMBuild || isBundlerESMBuild) &&
        !packageOptions.enableNonBrowserBranches,
        isGlobalBuild,
        isNodeBuild
      ),
      ...nodePlugins,
      ...plugins
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false
    }
  }
}

function createReplacePlugin(
  isProduction,
  isBundlerESMBuild,
  isBrowserESMBuild,
  isBrowserBuild,
  isGlobalBuild,
  isNodeBuild
) {
  const replacements = {
    __COMMIT__: `"${process.env.COMMIT}"`,
    __VERSION__: `"${masterVersion}"`,
    __DEV__: isBundlerESMBuild
      ? // preserve to be handled by bundlers
      `(process.env.NODE_ENV !== 'production')`
      : // hard coded dev/prod builds
      !isProduction,
    // this is only used during Vue's internal tests
    __TEST__: false,
    // If the build is expected to run directly in the browser (global / esm builds)
    __BROWSER__: isBrowserBuild,
    __GLOBAL__: isGlobalBuild,
    __ESM_BUNDLER__: isBundlerESMBuild,
    __ESM_BROWSER__: isBrowserESMBuild,
    // is targeting Node (SSR)?
    __NODE_JS__: isNodeBuild,
    __FEATURE_OPTIONS__: true,
    __FEATURE_SUSPENSE__: true,
    ...(isProduction && isBrowserBuild
      ? {
        'context.onError(': `/*#__PURE__*/ context.onError(`,
        'emitError(': `/*#__PURE__*/ emitError(`,
        'createCompilerError(': `/*#__PURE__*/ createCompilerError(`,
        'createDOMCompilerError(': `/*#__PURE__*/ createDOMCompilerError(`
      }
      : {})
  }
  // allow inline overrides like
  //__RUNTIME_COMPILE__=true yarn build runtime-core
  Object.keys(replacements).forEach(key => {
    if (key in process.env) {
      replacements[key] = process.env[key]
    }
  })
  return replace(replacements)
}

function createProductionConfig(format) {
  return createConfig(format, {
    file: resolve(`dist/${name}.${format}.prod.js`),
    format: outputConfigs[format].format
  })
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser')
  return createConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
      format: outputConfigs[format].format
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true
        }
      })
    ]
  )
}
