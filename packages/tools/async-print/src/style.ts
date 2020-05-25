export default `
  // 基础样式
  * {
    margin: 0;
    padding: 0;
  }

  html, body {
    font-size: 12pt;
    color: #000;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    caption-side: top;
    empty-cells: show;
  }

  table th,
  table td {
    padding: 8pt 0;
    text-align: left;
  }

  caption {
    width: 100%;
    padding: 8pt 0;
    text-align: left;
    border: none;
    border-bottom: 1pt solid #000;
  }

  @media screen {
    section {
      border: 1pt dashed #666;
      padding: 14mm 12mm 10mm;
    }
  }

  @media print {
    @page A4 {
      size: 210mm 290mm;
      margin: 20mm 15mm;
    }

    section {
      page: A4;
      page-break-after: always;
    }
  }

  article.print-wrapper {
    margin: 20pt auto;
  }

  // 工具样式
  .text-left {
    text-align: left;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .text-middle {
    vertical-align: middle;
  }

  .text-baseline {
    vertical-align: baseline;
  }

  .font-bold {
    font-weight: bold;
  }

  .font-normal {
    font-weight: normal;
  }

  .border {
    border: 1pt solid #000;
  }

  .border-top {
    border-top: 1pt solid #000;
  }

  .border-right {
    border-right: 1pt solid #000;
  }

  .border-bottom {
    border-bottom: 1pt solid #000;
  }

  .border-left {
    border-left: 1pt solid #000;
  }

  .no-border {
    border: none;
  }

  .clearfix::after {
    content: '';
    clear: both;
    display: block;
    height: 0;
    font-size: 0;
    display: block;
  }

  .clearfix {
    zoom: 1;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }
`
