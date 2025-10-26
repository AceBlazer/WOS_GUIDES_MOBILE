package com.wosguides

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class ConfigModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "Config"
    }

    override fun getConstants(): MutableMap<String, Any> {
        val constants: MutableMap<String, Any> = HashMap()
        constants["API_BASE_URL"] = BuildConfig.API_BASE_URL
        constants["ONESIGNAL_APP_ID"] = BuildConfig.ONESIGNAL_APP_ID
        return constants
    }
}
