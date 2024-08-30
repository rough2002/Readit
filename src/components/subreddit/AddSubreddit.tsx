import CreateSubredditForm from "./CreateSubredditForm";
import Modal from "./../Modal";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";

function CreateSubreddit() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="subreddit-form">
          <Button>
            <FaPlus />
            <span>Create Community</span>
          </Button>
        </Modal.Open>
        <Modal.Window name="subreddit-form">
          <CreateSubredditForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default CreateSubreddit;
