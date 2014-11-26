# Webview+ for iOs #

This project is a plugin for cordova/phonegap apps, and provides a replacement for **the UIWebView that includes the Nitro JS engine based on the WKWebView**.

Looking for [Webview+ for Android](https://github.com/ludei/webview-plus)?

## Webview+ Features, Advantages and Benefits  ##

* WebGL
* Better support for CSS3
* Faster JS (Nitro JS Virtual Machine)
* Support for IndexedDB 
* Crypto API
* Navigation Timing API
* HTML Template element

#### How to install the Webview+ in your current project ####

Even though it's a cordova-compatible plugin, some steps must be done for the installation. If you prefer, you can install it automatically using the [CocoonJS Command Line Interface](https://github.com/ludei/cocoonjs-cli). The cocoonjs-cli has the same usage and commands of [cordova-cli](https://github.com/apache/cordova-cli#project-commands).

Once the cocoonjs-cli is installed in your system, just type:

```
// Install Ludei's CLI
$ sudo npm install -g cocoonjs

$ cocoonjs create MyProject
$ cd MyProject
$ cocoonjs platform add ios
$ cocoonjs plugin add com.ludei.ios.webview.plus -d
$ cocoonjs run/emulate
```

The `-d` flag is used to activate the verbose mode.

#### Manual installation  ####

Refer to the hook located at ios/hooks/install.js for the steps needed to install the Webview+ manually.

### About the author ###

[Ludei](http://www.ludei.com) is a San Francisco based company, creators of CocoonJS. Ludei aims to empower HTML5 industry with a set of tools that eases the adoption of HTML5 as the target platform for every mobile development.
