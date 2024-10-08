interface MenuNode {
  url?: string
  label: string
  children?: MenuNode[]
}

export const useMenu = () => {
  const root = document.createElement('ul')
  root.className = 'menu'
  renderMenu(menus, root)
  document.body.appendChild(root)
}

export const renderMenu = (menus: MenuNode[], container: HTMLUListElement) => {
  menus.forEach((menu) => {
    const item = document.createElement('li')
    let label
    if (menu.url) {
      label = document.createElement('a')
      label.href = menu.url
    } else {
      label = document.createElement('div')
    }
    label.innerText = menu.label
    item.append(label)

    container.append(item)

    if (menu.children) {
      item.classList.add('sub-menu-item')
      const indicator = document.createElement('div')
      indicator.className = 'indicator'
      label.append(indicator)

      const subMenu = document.createElement('ul')
      subMenu.className = 'sub-menu'
      renderMenu(menu.children, subMenu)
      item.append(subMenu)
    }
  })
}

const menus: MenuNode[] = [
  {
    label: 'Home',
    url: '/'
  },
  {
    label: 'Basic Skills',
    children: [
      {
        label: 'Hello World',
        url: '/pages/basic/hello/'
      }
    ]
  },
  {
    label: 'Advance Skills',
    children: [
      {
        label: 'Update Scene',
        url: '/pages/advance/update_scene/'
      }
    ]
  },
  {
    label: 'Manual',
    children: [
      {
        label: 'Hello Cube',
        url: '/pages/manual/hello_cube/'
      },
      {
        label: 'Primitives',
        url: '/pages/manual/primitives/'
      },
      {
        label: 'Scene Graph',
        url: '/pages/manual/scenegraph/',
        children: [
          {
            label: 'Tank',
            url: '/pages/manual/scenegraph/tank/'
          }
        ]
      },
      {
        label: 'Primitives',
        url: '/pages/manual/primitives/'
      },
      {
        label: 'Materials',
        url: '/pages/manual/materials/'
      },
      {
        label: 'Textures',
        url: '/pages/manual/textures/'
      },
      {
        label: 'Lights',
        url: '/pages/manual/lights/'
      }
    ]
  }
]
