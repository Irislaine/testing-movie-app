const request = require('supertest')
const app = require('../app')


// variables used in the tests
const actor = {
    firstName: 'Jennifer',
    lastName: 'Lopes',
    nationality: 'New York',
    image: 'lorem.jpg',
    birthday: '1969-07-24'
}

const actorUpdate = {
    firstName: 'Rodrigo',
    lastName: 'Santoro',
    nationality: 'Brasil',
    image: 'lorem.jpg',
    birthday: '1975-08-22'
}

let actorId

const BASE_URL = '/api/v1/actors'


// Definition of the tests
test('POST => "BASE_URL" should return status code 201 and res.body.firstName === actor.firstName', async() => {

    const res = await request(app)
        .post(BASE_URL)
        .send(actor)

    actorId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(actor.firstName)
})


test('GET => "BASE_URL" should return status code 200 and res.body[0].firstName === actor.firstName', async()=> {

    const res = await request(app)
        .get(BASE_URL)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body[0].firstName).toBe(actor.firstName)
    expect(res.body).toHaveLength(1)
})


test('GET => "BASE_URL/:id" should return status code 200 and res.body.firstName === actor.firstName', async() => {
    
    const res = await request(app)
        .get(`${ BASE_URL }/${ actorId }`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(actor.firstName)
})


test('PUT => "BASE_URL/:id" should return status code 200 and res.body.firstName === actorUpdate.firstName ', async() => {

    const res = await request(app)
        .put(`${ BASE_URL }/${ actorId }`)
        .send(actorUpdate)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(actorUpdate.firstName)
})


test('DELETE => "BASE_URL/:id" should return status code 204', async()=> {

    const res = await request(app)
        .delete(`${ BASE_URL }/${ actorId }`)
    
    expect(res.statusCode).toBe(204)
})