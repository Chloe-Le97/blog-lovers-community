const totalLikes = (blogs) => {
   return blogs.reduce((sum,item)=>
        sum + item.likes
    ,0)
  }

const favoriteBlog = (blogs) =>{
  return blogs.reduce((prev, current) => (prev.y > current.y) ? prev : current)
}

module.exports = {
    totalLikes,
    favoriteBlog
  }

