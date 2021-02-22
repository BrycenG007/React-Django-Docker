import { Component, Fragment } from 'react';
import { connect  } from 'react-redux';
import { getTodos } from '../../redux/todo/selectors';
import { createTodoRequest } from '../../redux/todo/thunks';
import { withStyles } from '@material-ui/core/styles';
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';

const useStyles = (theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(3),
  },
});

class CreateTodoForm extends Component {
  state = {
    open: false,
    title: '',
    description: '',
    duplicated: false,
  };

  clear = () => {
    this.setState({
      title: '',
      description: '',
      duplicated: false,
    });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
    if (event.target.id === 'title') {
      this.setState({ duplicated: false });
    }
  };

  handleCancel = () => {
    this.handleClose();
    this.clear();
  }

  handleCreate = () => {
    const { todos, handleCreate } = this.props;
    const isDuplicated = todos.some((todo) => (
      todo.title === this.state.title
    ));
    if (isDuplicated) {
      this.setState({ duplicated: true });
    } else {
      handleCreate(this.state.title, this.state.description);
      this.handleClose();
      this.clear();
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<CreateIcon />}
          className={classes.button}
          onClick={this.handleOpen}
        >
          Create
        </Button>
        <Dialog 
          fullWidth={false}
          maxWidth="md"
          open={this.state.open} 
          onClose={this.handleClose}
          aria-labelledby="create todo form"
        >
          <DialogTitle>
            Create Todo
          </DialogTitle>
          <DialogContent>
            <form 
              className={classes.form} 
              noValidate
            >
              <TextField 
                fullWidth
                id="title" 
                label="Title" 
                variant="outlined" 
                placeholder="Type title here"
                error={this.state.duplicated}
                helperText={this.state.duplicated ? "Duplicated entry." : ""}
                className={classes.margin} 
                value={this.state.title}
                onChange={this.handleChange}
              />
              <TextField 
                fullWidth
                id="description" 
                label="Description" 
                variant="outlined" 
                placeholder="Type description here"
                className={classes.margin} 
                value={this.state.description}
                onChange={this.handleChange}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={this.handleCancel} 
            >
              Cancel
            </Button>
            <Button 
              color="primary"
              onClick={this.handleCreate}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  todos: getTodos(state),
});

const mapDispatchToProps = (dispatch) => ({
  handleCreate: (title, description) => dispatch(createTodoRequest(title, description)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(useStyles)(CreateTodoForm)
);
