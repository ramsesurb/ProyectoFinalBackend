import {CreateUserDto,GetUserDto} from  "../Daos/Dto/usersDto.js";


export class UsersRepository{
constructor(dao){
    this.dao = dao;
}
async getUser(){
    const users = await this.dao.Get()
    return users
}
async createUser(user){
    const usersDto = new CreateUserDto(user)
    const userCreated = await this.dao.post(usersDto)
    return userCreated
}

}