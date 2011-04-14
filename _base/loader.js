define(["./kernel", "../has", "require"], function(dojo, has, require) {
	//	module:
	//		dojo/_base/lader
	//	summary:
	//		This module defines the v1.x synchronous loader API.

	if (require.vendor!="dojotoolkit.org") {
		console.error("cannot load the Dojo v1.x loader with a foreign loader");
		return;
	}

	has.add("dojo-loader", 1, 0, 1);

	var dojoRequire= require.getDojoLoader(dojo, dojo.dijit, dojo.dojox);
		
	dojo.require= function(moduleName, omitModuleCheck) {
		var result= dojoRequire(moduleName);
		if (!omitModuleCheck && !result) {
			// TODO throw?
		}
		return result;
	};

	dojo.loadInit= function(f) {
		f();
	};

	dojo.requireLocalization= function(moduleName, bundleName, locale){
		// This function doesn't really do anything for the user since he must
		// call dojo.i18n.getLocalization to get access to a bundle. Therefore, just
		// no-op this API and implement sync fallback in dojo.i18n.getLocalization;
	};

	dojo.platformRequire = function(/*Object*/modMap){
		//	summary:
		//		require one or more modules based on which host environment
		//		Dojo is currently operating in
		//	description:
		//		This method takes a "map" of arrays which one can use to
		//		optionally load dojo modules. The map is indexed by the
		//		possible dojo.name_ values, with two additional values:
		//		"default" and "common". The items in the "default" array will
		//		be loaded if none of the other items have been choosen based on
		//		dojo.name_, set by your host environment. The items in the
		//		"common" array will *always* be loaded, regardless of which
		//		list is chosen.
		//	example:
		//		|	dojo.platformRequire({
		//		|		browser: [
		//		|			"foo.sample", // simple module
		//		|			"foo.test",
		//		|			["foo.bar.baz", true] // skip object check in _loadModule (dojo.require)
		//		|		],
		//		|		default: [ "foo.sample._base" ],
		//		|		common: [ "important.module.common" ]
		//		|	});

		var common = modMap.common || [];
		var result = common.concat(modMap[dojo._name] || modMap["default"] || []);

		for(var x=0; x<result.length; x++){
			var curr = result[x];
			if(curr.constructor == Array){
				dojo.require.apply(d, curr);
			}else{
				dojo.require(curr);
			}
		}
	};

	dojo.requireIf = dojo.requireAfterIf = function(/*Boolean*/ condition, /*String*/ resourceName, /*Boolean?*/omitModuleCheck){
		// summary:
		//		If the condition is true then call `dojo.require()` for the specified
		//		resource
		//
		// example:
		//	|	dojo.requireIf(dojo.isBrowser, "my.special.Module");
		
		if(condition){
			dojo.require(resourceName, omitModuleCheck);
		}
	};

	if (!dojo.requireLocalization) {
		dojo.requireLocalization = function(/*String*/moduleName, /*String*/bundleName, /*String?*/locale, /*String?*/availableFlatLocales){
			return dojo.require("dojo.i18n").getLocalization(moduleName, bundleName, locale);
		};
	}

	// FIXME: this dependency needs to be removed from the demos
	dojo._getText= require.getText;
});
