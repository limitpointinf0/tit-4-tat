const Instagram = require('instagram-web-api')
const username = 'coneal0523private@gmail.com';
const password = '90()opOPl;L:';
const client = new Instagram({username , password});

;(async () => {
  await client.login()
  const profile = await client.getProfile()

  console.log(profile)
})()
