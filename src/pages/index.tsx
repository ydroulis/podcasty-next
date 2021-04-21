//SPA(create react app)
//SSR
//SSG

import { useEffect } from "react"

export default function Home(props) {
  // consumindo api com SPA (create react app)....crawler não aguarda o consumo da api pra indexar os dados
  // useEffect(() =>{ 
  //   fetch('http://localhost:3333/episodes')
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  // }, [])

  return (
    <>
      <h1>Index</h1>
    </>
  )
}

// consumindo api com SSR com getServerSideProps executado toda vez que alguem acessar a home da nossa aplicação
// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return {
//     props: {
//       episodes: data,
//     }
//   }
//passar meus dados por pros para o componente: export default componente(props){}
//}

//consumindo api com SSG (apenas em produção pra funcionar)
export async function getStaticProps() {
    const response = await fetch('http://localhost:3333/episodes')
    const data = await response.json()
  
    return {
      props: {
        episodes: data,
      },
      revalidate: 60 * 60 * 8, //periodo para revalidar alterações da pagina
    }
    //passar meus dados por pros para o componente: export default componente(props){}
  }
