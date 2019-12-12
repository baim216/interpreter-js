# interpreter-js
一个简单的js运算符解释器

```
console.log(interpreter('1 > 2')); // false
console.log(interpreter('a >= 10', {a: 11})); // true
console.log(interpreter('a >= 10 && b <= 12', {a: 11, b: 12})); // true
```

# 使用方式
表达式以空格分割，所以传入的字符串需符合空格格式。
