import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter} from '../../utils/emitter';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
        }
    }

   

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('All');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }

    }

    handleAddNewModal = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    createNewUser = async (data) => {
        try { 
            let response =await createNewUserService(data);
            if(response && response.errCode !== 0) {
                alert(response.errMessage)
            }else{
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
            
        } catch (e) {
            console.log(e);
            
        }
    }

    handleDeleteUser = async (user) => {
        console.log('click delete', user)
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode ===0){
                await this.getAllUsersFromReact();
            }
            else 
            {
                alert(res.errMessage)
            }
        }catch(e){
            console.log(e);
        }
    }

    handleEditUser = (user) => {
        console.log(user);
        this.setState({
            isOpenModalEditUser: true
        })
    }


    render() {
        let arrUsers = this.state.arrUsers;
        console.log(arrUsers)
        return (
            <div className='users-container'>
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent= {this.toggleUserModal}
                    createNewUser= {this.createNewUser}
                />
                <ModalEditUser
                    isOpen={this.state.isOpenModalEditUser}
                    // toggleFromParent= {this.toggleUserModal}
                    // createNewUser= {this.createNewUser}
                />
                <div className="title text-center">Manage users</div>
                <div className='mx-1'>
                    <button
                        className='btn btn-primary px-3'
                        onClick={() => this.handleAddNewModal()}
                    
                    ><i className='fas fa-plus'></i> Add new users</button>
                </div>

                <div className='user-table mt-3 mx-1'>
                    <table id='customers'>
                       
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>

                            {arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => this.handleEditUser()}><i className='fas fa-pencil-alt'></i></button>
                                            <button className='btn-delete' onClick={() => this.handleDeleteUser(item)}><i className='fas fa-trash'></i></button>
                                        </td>
                                    </tr>

                                )
                            })}
                        
                    </table>
                </div>

            </div>
            
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
