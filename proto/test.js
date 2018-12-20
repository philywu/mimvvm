class BoundNode {
    constructor (node) {
      this.template = node.innerHTML
      this.node = node
    }
    
    update (data) {
      let temp_template = this.template.slice(0)
      this.node.innerHTML = temp_template.replace(/\{\{\s?(\w+)\s?\}\}/g, (match, variable) => {
      return data[variable] || ''
      })
    }
  }
  
  class BoundModel {
    constructor (handlers) {
      const callbacks = []
      const data = {
        add_callback: function add_callback (fn) {
          callbacks.push(fn)
        }
      }
  
      const proxy = new Proxy(data, {
        set: function (target, property, value) {
          target[property] = value
          callbacks.forEach((callback) => callback())
          return true
        }
      })
      
      return proxy 
    }
  }
  
  
  
  
  const quotes = [
    "What is the point of owning a race car if you can't drive it?",
    "Give me a scotch, I'm starving.",
    "I'm a huge fan of the way you lose control and turn into an enourmous green rage monster.",
    "I already told you, I don't want to join your super secret boy band.",
    "You know, it's times like these when I realize what a superhero I am."
  ]
  
  const my_node = new BoundNode(document.querySelector('.js-bound-quote'))
  const my_model = new BoundModel()
  
  my_model.add_callback(function () {
    my_node.update(my_model)
  })
  
  my_model.movie = 'Iron Man 2'
  window.setInterval(function () {
    my_model.quote = quotes[Math.floor(Math.random() * quotes.length)]
  }, 1000)
  
  
  
  
  describe('BoundNode', () => {
    let test_node, bound_test_node
    let test_node_text = 'My favorite movie is "{{ movie }}".'
    
    beforeEach(() => {
      test_node = document.createElement('div')
      test_node.innerHTML = test_node_text
      bound_test_node = new BoundNode(test_node)
    })
    
    afterEach(() => {
      test_node = null
      bound_test_node = null
    })
    
    it('remembers the original text as the template', () => {
      expect(bound_test_node.template).toBe(test_node_text)
    })
    
    it('can update the innerHTML', () => {
      const expected_text = 'My favorite movie is "Mrs. Doubtfire".'
      bound_test_node.update({
        movie: 'Mrs. Doubtfire'
      })
      expect(bound_test_node.node.innerHTML).toBe(expected_text)
    })
    
    it('can update the innerHTML multiple times', () => {
      const expected_text_1 = 'My favorite movie is "Mrs. Doubtfire".'
      const expected_text_2 = 'My favorite movie is "The Godfather".'
      bound_test_node.update({
        movie: 'Mrs. Doubtfire'
      })
      expect(bound_test_node.node.innerHTML).toBe(expected_text_1)
      
      bound_test_node.update({
        movie: 'The Godfather'
      })
      expect(bound_test_node.node.innerHTML).toBe(expected_text_2)
    })
  })
  
  describe('BoundModel', () => {
    let test_model
    
    beforeEach(() => {
      test_model = new BoundModel()
    })
    
    afterEach(() => {
      test_model = null
    })
    
    it('returns a Proxy instance', () => {
      expect(Object.getPrototypeOf(my_model)).toEqual({})
    })
    
    it('allows setting arbitrary values', () => {
      my_model.foo = 'bar'
      expect(my_model.foo).toBe('bar')
    })
    
    it('can accept a callback for setting values', () => {
      let has_been_called = false
      my_model.add_callback(() => {
        has_been_called = true
      })
      my_model.foo = 'bar'
      
      expect(has_been_called).toBe(true)
    })
    
    it('executes multiple callbacks on #set calls', () => {
      let calls = 0
      my_model.add_callback(function callback_1 () {
        calls++
      })
      my_model.add_callback(function callback_2 () {
        calls++
      })
      expect(calls).toBe(0)
      my_model.foo = 'bar'
      expect(calls).toBe(2)
    })
  })
  
  describe('Binding a node to a model', () => {
    it('shows that a model can be bound to a node in a sane way', () => {
      const quote_1 = "What is the point of owning a race car if you can't drive it?"
      const quote_2 = "Give me a scotch, I'm starving."
      
      const test_node = document.createElement('div')
      test_node.innerHTML = '<h1>{{ the_title }}</h1>'
      const test_bound_node = new BoundNode(test_node)
      
      const test_model = new BoundModel()
  
      test_model.add_callback(function () {
        test_bound_node.update(test_model)
      })
  
      test_model.the_title = 'Kung Fu Hustle'
      expect(test_node.innerHTML).toBe('<h1>Kung Fu Hustle</h1>')
      
      test_model.the_title = 'The Spy Who Loved Me'
      expect(test_node.innerHTML).toBe('<h1>The Spy Who Loved Me</h1>')
    })
  })