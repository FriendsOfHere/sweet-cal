/*
 * This file is part of app.here.tinycal.
 *
 * Copyright (c) 2020 Lifesign.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

const pref = require("pref")
const moment = require("moment")
const net = require("net")
const config = require("./config.json")

function getCustomTimeFormat() {
    const DEFAULT_TIME_FORMAT = "YYYY-MM-DD HH:mm";
    let timeFormat = pref.get("custom-time-format");

    return timeFormat == undefined || timeFormat == "" ? DEFAULT_TIME_FORMAT : timeFormat
}

function updateData() {

    let timeFormat = getCustomTimeFormat()
    //if (!moment("", timeFormat).isValid()) {
        // here.systemNotification(`"【插件】${config.name}"`, `时间格式【${timeFormat}】配置有误`)
    //}

    // Menu Bar
    here.setMenuBar({ title: moment().format(timeFormat)})
        
}

here.onLoad(() => {
    updateData()
    // Update every 1 min
    setInterval(updateData, 1000*60);
})

net.onChange((type) => {
    console.log("Connection type changed:", type)
    if (net.isReachable()) {
        updateData()
    }
})
