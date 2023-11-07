console.log("Webpack Working!!! 📦");

// Codigo ES6
// Default Parameters
let show = (msg="No message given") => {
  console.log(msg)
}
show();

// Async Await
function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000)
  });
}

async function asyncCall() {
  console.log("Calling");
  const result = await resolveAfter2Seconds();
  console.log(result);
}

asyncCall();