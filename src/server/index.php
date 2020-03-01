<?php
   date_default_timezone_set('PRC');
   $isDark = isset($_GET['isDark']) ? (bool)$_GET['isDark'] : true;
?>
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
    <meta http-equiv='x-ua-compatible' content='ie=edge'>
    <!-- IMPORTANT: No CSS link needed as of v1 Beta (@next) - It's all inlined -->
    <!-- Pre v1.0.0 versions need the minified css -->
    <!-- <link rel='stylesheet' href='https://unpkg.com/v-calendar/lib/v-calendar.min.css'> -->
    <style>
      body
      {
          background-color: <?php echo $isDark ? '#1A202C': 'white';?>;
      }
    </style>
  </head>

  <body>
    <div id='here'>
      <!-- <v-calendar></v-calendar> -->
      <v-calendar
        :mode='mode'
        :color='color'
        :is-dark='darkMode'
        is-expanded
        :attributes='attrs'
        :locale='locale'
        :theme="theme"
        />
        </v-calendar>

    </div>

    <!-- 1. Link Vue Javascript -->
    <script src='https://unpkg.com/vue/dist/vue.js'></script>

    <!-- 2. Link VCalendar Javascript (Plugin automatically installed) -->
    <!-- @next v1 Beta  -->
    <script src='https://unpkg.com/v-calendar@next'></script>
    <!-- Latest stable (Right now, this is very different from the v1 Beta)-->
    <!-- <script src='https://unpkg.com/v-calendar'></script> -->
    <!-- Hardcoded version -->
    <!-- <script src='https://unpkg.com/v-calendar@1.0.0-beta.14/lib/v-calendar.umd.min.js'></script> -->

    <!--3. Create the Vue instance-->
<script>
      new Vue({
        el: '#here',
        data: {
          mode: 'single',
          color: <?php echo json_encode($isDark ? 'red' : 'green');?>,
          darkMode: <?php echo json_encode($isDark);?>,
          attrs: [
            {
              key: 'today',
              highlight: true,
              dates: new Date(<?php echo json_encode(date('D M d Y H:i:s O'));?>),
            },
            {
              dot: true,
              dates: [{
                start: null,
                weekdays: [1, 7]
              }],
            },
          ],
          locale: {
              id: 'zh-CN',
              masks: {
                title: 'YYYY / MM',
                weekdays: 'WW',
              }
          },
          // see 
          // https://github.com/nathanreyes/v-calendar/blob/next/src/utils/defaults/theme.js
          theme: {
           container: {
              light:
                // 'vc-text-gray-900 vc-bg-white vc-border vc-border-gray-400 vc-rounded-lg',
                'vc-text-gray-900 vc-bg-white',
              dark:
                'vc-text-gray-200 vc-bg-gray-900',
            },
            // title: {
            //     light: "vc-text-lg text-style--dark hover:vc-opacity-75",
            // },
            // arrows: {
            //     light: "text-style--dark hover:vc-opacity-50",
            // },
            // weekdays: {
            //     light: "vc-text-sm vc-font-bold text-style--gray",
            // },
            // navPopoverContainer: {
            //     light: "vc-rounded vc-text-sm text-style--dark vc-bg-white vc-shadow",
            // },
          }
        }
      })
    </script>
  </body>
</html>
