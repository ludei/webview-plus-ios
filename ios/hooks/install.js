var path = require('path');
var fs 	= require('fs');

function WebViewPlusInstaller(project_path, cmd) {
	
	try {
    // Install this plugin only on Cordova <= 4.0.0
    var version = cmd.exec("--version", { silent : true });

    if(version.code !== 0){
        console.error("Cannot install the Webview+ for iOs in your project because a valid cordova-cli binary wasn't found.");
    }

    if( parseFloat(version.output) > parseFloat('4.0.0') ){
        throw new Error("This plugin should be installed using cordova 4.0.0 or below. Your cordova version is " + version.output);
    }

    var platform_path = path.join(project_path, "platforms", "ios");
    var plugins_path = path.join(project_path, "plugins", "com.ludei.ios.webview.plus");
    var folderContent = fs.readdirSync(platform_path);
   	var xcodeproj_path = folderContent.filter(function(item){ return item.indexOf("xcodeproj") !== -1; })[0];
	var xcodeproj_name = xcodeproj_path.split(".")[0];

    if (!xcodeproj_path) {
    	throw new Error("Cannot find a valid 'xcodeproj' inside " + platform_path);
    }

    xcodeproj_path = path.join(platform_path, xcodeproj_path);
    var pbxpath = path.join(xcodeproj_path, "project.pbxproj");
    var original_pbx = path.join(xcodeproj_path, "original_pbx.pbxproj");
    
    var gnu_compiler = 'CLANG_ENABLE_OBJC_ARC = YES;';
    var morti_compiler = 'CLANG_CXX_LANGUAGE_STANDARD = "c++0x"; CLANG_CXX_LIBRARY = "libc++";\nCLANG_ENABLE_OBJC_ARC = YES;\n';

    var valid_archs_pattern = 'TARGETED_DEVICE_FAMILY = "1,2";';
    var valid_archs = valid_archs_pattern + '\nVALID_ARCHS = "armv7 i386";'
    
    // Save a copy of the original PBX
    fs.writeFileSync(original_pbx, fs.readFileSync(pbxpath));

    var pbx_content = fs.readFileSync(pbxpath, "utf8");
    var fileRef = pbx_content.match(/fileRef = [A-Z0-9]* \/\* cocoonjs.cf \*\/;/)[0].split('fileRef = ')[1].split(" ")[0];

    // Rename the main file
    var original_main = path.join(platform_path, xcodeproj_name, "main.m");
    var new_main = path.join(platform_path, xcodeproj_name, "main.mm");
    
    fs.renameSync(original_main, new_main);
    pbx_content = pbx_content.replaceAll("main.m", "main.mm");

    var main_content = fs.readFileSync(new_main, "utf8");
    
    var PBXBuildFile = '590E6E6B1A14FE6800E733FF /* cocoonjs.cf in Resources */ = {isa = PBXBuildFile; fileRef = ' + fileRef + ' /* cocoonjs.cf */; };';
    var PBXBuildFilePattern = '/* Begin PBXBuildFile section */';
    var PBXResourcesBuildPhase = '590E6E6B1A14FE6800E733FF /* cocoonjs.cf in Resources */,';
    var PBXResourcesBuildPhasePattern = 'in Resources */,';

    var LinkingLibraries = '"-force_load", "$(SRCROOT)/$(PROJECT_NAME)/Plugins/com.ludei.ios.webview.plus/Release$(EFFECTIVE_PLATFORM_NAME)-libCocoonJS_force_load.a", "$(SRCROOT)/$(PROJECT_NAME)/Plugins/com.ludei.ios.webview.plus/Release$(EFFECTIVE_PLATFORM_NAME)-libCocoonJS.a",';
    var LinkingLibrariesPattern = 'OTHER_LDFLAGS = (';
    pbx_content = pbx_content.replaceAll( LinkingLibrariesPattern, LinkingLibrariesPattern + "\n" + LinkingLibraries);
    
    pbx_content = pbx_content.replace( PBXResourcesBuildPhasePattern, PBXResourcesBuildPhasePattern + "\n" + PBXResourcesBuildPhase);
    pbx_content = pbx_content.replace( PBXBuildFilePattern, PBXBuildFilePattern + "\n" + PBXBuildFile);

    // Set default compiler to C++11
    pbx_content = pbx_content.replaceAll( gnu_compiler, morti_compiler);
    
    /**
    * Replace archs (deprecated)
    */
    //pbx_content = pbx_content.replaceAll( valid_archs_pattern, valid_archs);
    
    /**
    * Set format as Objective-c
    */
    pbx_content = pbx_content.replace('lastKnownFileType = sourcecode.c.objc; path = main.mm;', "explicitFileType = sourcecode.cpp.objcpp; path = main.mm;");
    
    /**
    * Replace the main delegate
    */
    var mainmmDelegate = 'float version = UIDevice.currentDevice.systemVersion.floatValue;\n int retVal = UIApplicationMain(argc, argv, nil, version >= 8.0 ? @"CocoonJSAppDelegate" : @"AppDelegate");';
    var mainmmDelegatePattern = 'int retVal = UIApplicationMain(argc, argv, nil, @"AppDelegate");';
    main_content = main_content.replace(mainmmDelegatePattern,mainmmDelegate);
    
    fs.writeFileSync(new_main, main_content, "utf8");
    fs.writeFileSync(pbxpath, pbx_content, "utf8");

    console.log("Webview+ installed correctly in your CocoonJS project :)");
    }
    catch (e) {
       throw new Error(e);
    }
}

module.exports = WebViewPlusInstaller;