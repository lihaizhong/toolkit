export default `
  <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <meta name="robots" content="none">
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta http-equiv="cache-control" content="no-cache">
        <meta http-equiv="Cache-Control" content="no-siteapp" />
        <meta http-equiv="expires" content="Tue Jan 07 2020 11:19:57 GMT+0800" />
        <title>{{ title }}</title>
        <style>{{ printTemplateDefaultStyle }}</style>
      </head>
      <body>
          <article class="print-wrapper" style="width: {{ width }};">
            {{body}}
          </article>
      </body>
    </html>
`
