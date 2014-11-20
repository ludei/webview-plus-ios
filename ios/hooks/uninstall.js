var path = require('path');
var fs = require('fs');

function WebViewPlusUninstaller(project_path) {
	
	try {
    
    var platform_path = path.join(project_path, "platforms", "ios");
    var plugins_path = path.join(project_path, "plugins", "com.ludei.ios.webview.plus");
    var folderContent = fs.readdirSync(platform_path);
   	var xcodeproj_path = folderContent.filter(function(item){ return item.indexOf("xcodeproj") !== -1; })[0];
	var xcodeproj_name = xcodeproj_path.split(".")[0];

    if(!xcodeproj_path){
    	throw new Error("Cannot find a valid 'xcodeproj' inside " + platform_path);
    }

    xcodeproj_path = path.join(platform_path, xcodeproj_path);
    var pbxpath = path.join(xcodeproj_path, "project.pbxproj");
    var original_pbx = path.join(xcodeproj_path, "original_pbx.pbxproj");
    
    fs.writeFileSync(pbxpath, fs.readFileSync(original_pbx));

    // Rename the main file
    var original_main = path.join(platform_path, xcodeproj_name, "main.m");
    var new_main = path.join(platform_path, xcodeproj_name, "main.mm");

    fs.renameSync(new_main, original_main);

    var main_content = fs.readFileSync(original_main, "utf8");
        main_content = main_content.replace("CocoonJSAppDelegate","AppDelegate");

    fs.writeFileSync(original_main, main_content, "utf8");

    }
    catch (e) {
       console.error(e);
    }
}

module.exports = WebViewPlusUninstaller;