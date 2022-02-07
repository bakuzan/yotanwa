function log(name: string, others: any[]) {
  if (window && window.console && window.console.log) {
    window.console.log(
      `%c :: [Yotanwa] ::` + `%c Location: ${name};`,
      `color: #7f7ec2;font-size:16px;`,
      `color: #fabf40;font-size:16px;`,
      ...others
    );
  }
}

export default function createLogger(name: string) {
  return function logger(...others: any[]) {
    log(name, others);
  };
}
