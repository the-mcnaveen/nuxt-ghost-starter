import GhostContentAPI from '@tryghost/content-api'

// we have this function accept variables to be accessible to config.js
const ghost = (url, key) => {
  return new GhostContentAPI({
    url,
    key,
    version: 'v2'
  })
}

const generateRoutes = async () => {
  const host = process.env.GHOST_URI
  const key = process.env.GHOST_KEY
  const perPage = process.env.POSTS_PER_PAGE

  const api = ghost(host, key)

  // initialize array of routes to be filled
  const routes = []

  // create posts pages and paginated (index) posts
  // do while posts.meta.pagination.next
  let nextPage = 1
  do {
    const posts = await api.posts.browse({
      limit: perPage,
      page: nextPage,
      order: 'published_at DESC'
    })

    /*
    * To Do: Limit data passed into post list pages
    */

    if (nextPage === 1) {
      // push first PER_PAGE posts info to index
      // we may want to pick a limited set of info in the future
      routes.push({
        route: '/',
        payload: posts
      })
      posts.forEach((post) => {
        routes.push({
          route: '/' + post.slug,
          payload: post
        })
      })
    } else {
      routes.push({
        route: '/page/' + posts.meta.pagination.page,
        payload: posts
      })
      posts.forEach((post) => {
        routes.push({
          route: '/' + post.slug,
          payload: post
        })
      })
    }

    nextPage = posts.meta.pagination.next
  } while (nextPage)

  // // get pages
  // const pages = await api.pages.browse({
  //   fields: 'title,slug,id',
  //   limit: 'all',
  //   order: 'name ASC' })

  // pages.forEach((page) => {
  //   routes.push({
  //     route: '/' + page.slug,
  //     payload: page
  //   })
  // })

  // // create tag routes
  // const tags = await api.tags.browse({
  //   fields: 'name,slug,id',
  //   limit: 'all',
  //   filter: 'visibility:public' })

  // tags.forEach((tag) => {
  //   routes.push({
  //     route: '/tag/' + tag.slug,
  //     payload: tag
  //   })
  // })

  // // create author routes
  // const authors = await api.authors.browse({
  //   fields: 'id,slug,name',
  //   limit: 'all'
  // })

  // authors.forEach((author) => {
  //   routes.push({
  //     route: '/author/' + author.slug,
  //     payload: author
  //   })
  // })

  return routes
}

const ghostAPI = () => {
  // called as function to make sure env variables are available
  return ghost(process.env.GHOST_URI, process.env.GHOST_KEY)
}

export { ghostAPI, generateRoutes }
