import React from 'react'
import _ from 'lodash'
import {
    Header,
    Icon,
    Tab,
    List,
    Button,
    Divider,
    Modal,
    Input,
    Message,
    Form,
} from 'semantic-ui-react'
import ReeValidate from 'ree-validate'

import Admin from '../../layouts/admin'
import {UserService} from '../../services'

class Page extends React.Component {
    constructor(props) {
        super(props);

        this.validator = new ReeValidate({
            name: 'required|min:5',
        });

        // if (this.props.user.id) {

        //     this.props
        //         .dispatch( UserService.getUserById(this.props.user.id) )
        //         .catch(({error, statusCode}) => {
        //             console.log(error)
        //         })

        // }

        const user = this.props.user.toJson();
        const change_user = this.props.user.toJson();

        this.state = {
            user,
            edit_modal: false,
            change_user,

            errors: this.validator.errors
        }


        //
        this.showEditModal = this.showEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        const user = nextProps.user.toJson();
        const change_user = nextProps.user.toJson();

        if (!_.isEqual(this.state.user, user)) {
          this.setState({ user })
          this.setState({ change_user })
        }
    }

    handleChangeName(event) {
        event.preventDefault();

        const {change_user} = this.state;

        this.validator
            .validateAll({name:change_user.name})
            .then(success => {
                if (success) {
                    this.setState({
                        isLoading: true
                    });
                    this.closeEditModal();
                    this.changeName(change_user);
                }
            });
    }

    changeName(user) {
        this.props.dispatch(UserService.changeName(user))
            .then((result)  => {

                this.setState({
                    isLoading: false
                });
                this.setState({
                    isSuccess: true,
                });

                this.setState({
                    user: result.user
                });
            })
            .catch(({error, statusCode}) => {
                const responseError = {
                    isError: true,
                    code: statusCode,
                    text: error,
                };
                this.setState({responseError});
                this.setState({
                    isLoading: false
                });

                console.log(responseError);
            })
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        const {change_user} = this.state;
        change_user[name] = value;

        this.validator.validate(name, value)
            .then(() => {
                const {errors} = this.validator;
                this.setState({errors: errors, change_user})
            });
    }

    showEditModal() {
      this.setState({ edit_modal: true })
    }

    closeEditModal() {
      this.setState({ edit_modal: false })
    }

    render() {
        const {errors} = this.state;
        const { edit_modal, user } = this.state;
        const { name } = this.state.change_user;

        const panes = [
          { menuItem: 'General', render: () =>
            <Tab.Pane basic attached={false}>
              <List divided verticalAlign='middle'>
                <List.Item>
                  <List.Content floated='right' verticalAlign='middle'>
                    {user.name} &nbsp;
                    <Button basic onClick={this.showEditModal}>Edit</Button>
                  </List.Content>
                  <List.Content verticalAlign='middle'>
                    Name
                  </List.Content>
                </List.Item>

                <List.Item>
                  <List.Content floated='right' verticalAlign='middle'>
                    {user.email} &nbsp;
                    <Button basic>Edit</Button>
                  </List.Content>
                  <List.Content verticalAlign='middle'>
                    Email address
                  </List.Content>
                </List.Item>
              </List>
            </Tab.Pane>
          },
          { menuItem: 'Access', render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane> },
        ];

        return (
            <Admin>
                <Header as='h3'>Account</Header>
                
                <Tab menu={{ secondary: true, pointing: true }} panes={panes} grid={{paneWidth: 5}} />

                <div>
                  <Modal size='tiny' open={edit_modal} onClose={this.closeEditModal}>
                    <Modal.Header>
                      Change your name
                    </Modal.Header>
                    <Modal.Content>
                    <Form onSubmit={this.handleChangeName}>
                      <Form.Field error={errors.has('name')}>
                        <Input
                          required
                          placeholder='Your name'
                          name="name"
                          value={name}
                          type="text"
                          onChange={this.handleChange}
                        />
                        <Message negative floating size='mini' hidden={!errors.has('name')} style={{'position':'absolute'}}>
                            {errors.first('name')}
                        </Message>
                      </Form.Field>
                    </Form>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button color="blue" onClick={this.handleChangeName} content='Change name' />
                      <Button basic onClick={this.closeEditModal}>
                        Cancel
                      </Button>
                    </Modal.Actions>
                  </Modal>
                
                </div>
            </Admin>
        );
    }
}

export default Page;
