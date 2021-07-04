function testable(...arg) {
  console.info('**decorate1**', arg);
  return function(target) {
    target.prototype.txm = 8888
  }
}

function log(target, name, descriptor) {
  console.info('**decorate4**', target, name, descriptor)
  const value = descriptor.value

  descriptor.value = function() {
    console.info('**decorate6**')
    value()
    return 'decorator value 666'
  }
  return descriptor
}

@testable(true)
class test {
  constructor(...arg) {
    console.info('**decorate2**', arg); 
  }

  @log
  testLog() {
    console.info('**decorate3**')
  }
}

export default test
