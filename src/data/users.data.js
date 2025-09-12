export const users = {
    standard: {
      username: 'standard_user',
      password: 'secret_sauce'
    },
    locked: {
      username: 'locked_out_user',
      password: 'secret_sauce'
    },
    invalidLogin: {
      email: "foo@bar.com",
      password: "wrong" 
    },
    valid: { 
      email: "eve.holt@reqres.in",
      password: "cityslicka" },
    invalid: {
      email: "foo@bar.com",
      password: "wrong" 
    },
    errormsgInvalid: "do not match",
    errormsgLocked: "locked"
  };