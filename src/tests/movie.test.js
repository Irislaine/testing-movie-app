require('../models')
const request = require('supertest')
const app = require('../app')

//Imports of models required in tests 
const Actor = require('../models/Actor')
const Director = require('../models/Director')
const Genre = require('../models/Genre')

//variables test
const movie = {
    name:'Sr. y Sra. Smith',
    image:'https://doblaje.fandom.com/es/wiki/Sr._y_Sra._Smith',
    symnopsis:'American action and comedy film',
    releaseYear:'2005-04-06',
}

const movieUpdate = {
    name: 'Jefa por accidente',
}

let movieId, actor, director, genre

const BASE_URL = '/api/v1/movies'

//Hooks
afterAll(async()=>{
    await actor.destroy()
    await director.destroy()
    await genre.destroy()
})


// Tests
test('POST => "BASE_URL" should return status code 201 and res.body.name === movie.name', async() => {

    const res = await request(app)
        .post(BASE_URL)
        .send(movie)

    movieId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(movie.name)
})


test('GET => "BASE_URL" should return status code 200 and res.body[0].name === movie.name', async()=> {

    const res = await request(app)
        .get(BASE_URL)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body[0].name).toBe(movie.name)
    expect(res.body).toHaveLength(1)
})


test('GET => "BASE_URL/:id" should return status code 200 and res.body.name === movie.name', async() => {
    
    const res = await request(app)
        .get(`${ BASE_URL }/${ movieId }`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(movie.name)
})


test('PUT => "BASE_URL/:id" should return status code 200 and res.body.name === movieUpdate.name ', async() => {

    const res = await request(app)
    .put(`${ BASE_URL }/${ movieId }`)
    .send(movieUpdate)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(movieUpdate.name)
})

test('POST => /:id/actors return status code 200 and res.body[0].movieActors.actorId === actor.id', async()=> {

    actor = await Actor.create({
        firstName: 'Rodrigo',
        lastName: 'Santoro',
        nationality: 'Brasil',
        image: 'lorem.jpg',
        birthday: '1975-08-22'
    })
    
    const res = await request(app)
        .post(`${ BASE_URL }/${ movieId }/actors`)
        .send([actor.id])
    
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    expect( res.body[0].movieActors.actorId ).toBe( actor.id )
    expect( res.body[0].movieActors.movieId ).toBe( movieId )

})

test('POST => /:id/directors return status code 200 and res.body[0].movieDirectors.directorId === director.id', async()=> {

    director = await Director.create({
        firstName: 'Steven',
        lastName: 'Spielberg',
        nationality: 'Unite State',
        image: 'lorem.png',
        birthday: '1946-12-18'
    })

    const res = await request(app)
        .post(`${ BASE_URL }/${ movieId }/directors`)
        .send([director.id])
    
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    expect( res.body[0].movieDirectors.directorId ).toBe( director.id )
    expect( res.body[0].movieDirectors.movieId ).toBe( movieId )

})

test('POST => /:id/genres return status code 200 and res.body[0].movieGenres.genreId === genre.id', async()=> {

    genre = await Genre.create({
        name: 'Action',
    })

    const res = await request(app)
        .post(`${ BASE_URL }/${ movieId }/genres`)
        .send([genre.id])
    
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    expect( res.body[0].movieGenres.genreId ).toBe( genre.id )
    expect( res.body[0].movieGenres.movieId ).toBe( movieId )

})


test('DELETE => "BASE_URL/:id/actors" should return status code 204', async()=> {
    const res = await request(app)
        .delete(`${ BASE_URL }/${ movieId }`)
    
    expect(res.statusCode).toBe(204)
})