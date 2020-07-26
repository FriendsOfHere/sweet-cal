/*
 * This file is part of foh.sweet-cal.
 *
 * Copyright (c) 2020 Lifesign.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */
const _ = require("lodash")
const pref = require("pref")
const moment = require("moment")
const net = require("net")
const config = require("./config.json")
const lunarTool = require("./solarlunar.min.js")

function getCustomTimeFormat() {
    const DEFAULT_TIME_FORMAT = "YYYY-MM-DD HH:mm";
    let timeFormat = pref.get("custom-time-format");

    return timeFormat == undefined || timeFormat == "" ? DEFAULT_TIME_FORMAT : timeFormat
}

function getLunarFormat() {
    return _.toSafeInteger(pref.get("lunarFormat"))
}

function isAnimalYearEnable() {
    return _.toSafeInteger(pref.get("animalYear")) == 1
}

function updateData() {

    let timeFormat = getCustomTimeFormat()
    //if (!moment("", timeFormat).isValid()) {
        // here.systemNotification(`"【插件】${config.name}"`, `时间格式【${timeFormat}】配置有误`)
    //}
    let suffix = ""
    let lunar = lunarTool.solar2lunar(moment().year(), moment().months() + 1, moment().date())
    let lunarOption = getLunarFormat()

    //lunar
    if (_.includes([1,2], lunarOption)) {
        //console.log(`${moment().year()} ${moment().months()} ${moment().date()}`)
        //console.log(JSON.stringify(lunarTool.solar2lunar(moment().year(), moment().months() + 1, moment().date())))
        suffix = lunarOption == 1 ? lunar.dayCn : `${lunar.monthCn}${lunar.dayCn}`
    }

    //animal year
    if (isAnimalYearEnable()) suffix = `${suffix} ${lunar.animal}年`

    // Menu Bar
    let menuBarTime = `${moment().format(timeFormat)} ${suffix}`
    here.menuBar.set({ title: menuBarTime})

    //popover api
    if (typeof(here.popover) != "undefined") {
        here.exec('defaults read -g AppleInterfaceStyle /dev/null 2>&1')
              .then((output) => {
                console.log(`Get dark mode: ${output}`)
                let isDark = 1;
                //due to a nightly version length bug
                if (output.indexOf("Dark") == -1) {
                  isDark = 0
                }

                console.log('setting popover...')
                here.popover.set({
                    "type": "webView",
                    "data": {
                        // url: `http://localhost:10010?isDark=${isDark}`,
                        url: './server/index.html',
                        width: 320,
                        height: 300,
                        // backgroundColor: "#FAF8EF",
                        backgroundColor: `${isDark == 1 ? '#1A202C' : '#FEFEFE'}`,
                        hideStatusBar: true
                    }
                })
            }).catch((err) => {console.err(`detect dark mode error : ${err}`)})
    }
}


here.onLoad(() => {
    /**
     * Dark mode can use css to auto switch
     * the local server logic can be omitted for now
     */
    // ensureLocalServerRunning()
    updateData()
    // Update every 1 min
    setInterval(updateData, 1000*60);
})

function ensureLocalServerRunning() {
    here.exec(`ps -ef | grep php | grep -v grep | grep localhost:10010 | awk '{print $2}'`)
    .then((output) => {
        const pid = _.trimEnd(output, "\n")
        console.log(`get php local server pid: ${output}`)
        //restart a php local server
        if (pid == '') {
            here.exec(`php -S localhost:10010 -t ./server`)
            .then((output) => {
              console.log(`PHP local server start listening on 10010.. output: ${output}`)
            }).catch((err) => { console.error(`start php local server err: ${err}`)})
        }
    }).catch((err) => {console.error(err)})
}

net.onChange((type) => {
    console.log("Connection type changed:", type)
    if (net.isReachable()) {
        updateData()
    }
})
