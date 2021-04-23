import { GetStaticProps } from "next"
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { api } from "../services/api"
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"
import { useContext } from "react"
import { PlayerContext } from "../contexts/playerContext"

import styles from './home.module.scss'

//import { useEffect } from "react"

type Episode = {
  id: string,
  title: string,
  type: string,
  thumbnail: string,
  members: string,
  duration: number,
  durationAsString: string,
  url: string,
  publishedAt: string,
}

type HomeProps = {
  latestEpisodes: Episode[];// ou Array<Episodes>
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  // consumindo api com SPA (create react app)....crawler não aguarda o consumo da api pra indexar os dados
  // useEffect(() =>{ 
  //   fetch('http://localhost:3333/episodes')
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  // }, [])
  const { playList } = useContext(PlayerContext);

  const episodeList = [ ...latestEpisodes, ...allEpisodes ];

  return (
    <div className={styles.homePage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} objectFit='cover' />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}><a>{episode.title}</a></Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type='button' onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}><a>{episode.title}</a></Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type='button' onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
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
export const getStaticProps: GetStaticProps = async () => {
  //const response = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc') req com fetch
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  }) //req com axios

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, //periodo para revalidar alterações da pagina
  }
  //passar meus dados por pros para o componente: export default componente(props){}
}
