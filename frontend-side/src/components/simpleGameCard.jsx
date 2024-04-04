/* eslint-disable react/prop-types */

const getDateFromTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
}

const SimpleGameCard = ({ game, cover }) => {
    /**
     * game: {
     * id
     * first_release_date: number
     * name
     * summary
     * url
     * }
     */
    if (Object.keys(game).length === 0) return null
    return (
        <article>
            <img src={cover} alt={`${game.name} cover image`} width={90}/>
            <strong><a href={game.url}>{game.name}</a></strong>
            <span>{getDateFromTimestamp(game.first_release_date)}</span>
        </article>
    )
}

export default SimpleGameCard