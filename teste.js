try {
  const error = new Error()
  console.log("vai tomando a execution")
  throw error
} catch (error) {
  console.error(error.name)
  console.error(error.message)
  console.error(typeof error)
}

