import Model from '../utils/Model'

class User extends Model {
  
  constructor(props) {
    super(props)

    this.initialize(props)
  }

  initialize(props) {
    super.initialize(props)

    this.first_name = props.first_name || ''
    this.last_name = props.last_name || ''
    this.email = props.email || ''
    this.avatar = props.avatar || ''
    this.provider = props.provider || ''
    this.phone = props.phone || ''
    this.about = props.about || ''
    this.is_admin = props.is_admin || 0
  }
}

export default User
