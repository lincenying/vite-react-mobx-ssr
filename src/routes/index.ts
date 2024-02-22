const pages = import.meta.glob('../pages/*.tsx', { eager: true })

const routes = Object.keys(pages).map((path) => {
    const name = path.match(/\.\.\/pages\/(.*)\.tsx$/)![1]

    let pathname = ''
    if (name === 'Article')
        pathname = '/article/:id'
    else if (name === 'Home')
        pathname = '/'
    else
        pathname = `/${name.toLowerCase()}`

    return {
        name,
        path: pathname,
        component: (pages[path] as Obj).default as () => JSX.Element,
        // 在组件文件中定义的SSR预取钩子
        prefetch: (pages[path] as Obj).prefetch as PromiseFn,
    }
})

export type AppRoutes = typeof routes
export const createRoutes = (): AppRoutes => routes
