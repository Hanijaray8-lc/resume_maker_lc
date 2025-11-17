import React, { useState } from "react";
import {
  Typography,
  TextField,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

const RichTextEditor = ({ value, onChange }) => {
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const applyFormat = (before, after) => {
    const textarea = document.getElementById("desc-box");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    setHistory([...history, value]);
    onChange(newText); // ✅ update parent state
    setFuture([]);
  };

  const undo = () => {
    if (history.length > 0) {
      const prev = history.pop();
      setFuture([value, ...future]);
      onChange(prev); // ✅ update parent
      setHistory([...history]);
    }
  };

  const redo = () => {
    if (future.length > 0) {
      const next = future.shift();
      setHistory([...history, value]);
      onChange(next); // ✅ update parent
      setFuture([...future]);
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Job description:
      </Typography>

      <TextField
        id="desc-box"
        fullWidth
        multiline
        rows={6}
        placeholder="Type your achievements and responsibilities here."
        value={value} // ✅ controlled by parent
        onChange={(e) => onChange(e.target.value)} // ✅ send changes to parent
      />

      {/* Rich text buttons */}
      <Box display="flex" gap={1} mt={1}>
        <Tooltip title="Bold">
          <IconButton size="small" onClick={() => applyFormat("**", "**")}>
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton size="small" onClick={() => applyFormat("*", "*")}>
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton size="small" onClick={() => applyFormat("<u>", "</u>")}>
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bullet List">
          <IconButton size="small" onClick={() => applyFormat("\n- ", "")}>
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Insert Link">
          <IconButton
            size="small"
            onClick={() => applyFormat("[", "](https://)")}
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Undo">
          <IconButton size="small" onClick={undo}>
            <UndoIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Redo">
          <IconButton size="small" onClick={redo}>
            <RedoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default RichTextEditor;
{/*import React, { useState } from "react";
import {
  Typography,
  TextField,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

const RichTextEditor = () => {
  const [description, setDescription] = useState("");
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const applyFormat = (before, after) => {
    const textarea = document.getElementById("desc-box");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);
    const newText =
      description.substring(0, start) +
      before +
      selectedText +
      after +
      description.substring(end);

    setHistory([...history, description]);
    setDescription(newText);
    setFuture([]);
  };

  const undo = () => {
    if (history.length > 0) {
      const prev = history.pop();
      setFuture([description, ...future]);
      setDescription(prev);
      setHistory([...history]);
    }
  };

  const redo = () => {
    if (future.length > 0) {
      const next = future.shift();
      setHistory([...history, description]);
      setDescription(next);
      setFuture([...future]);
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Job description:
      </Typography>

      <TextField
        id="desc-box"
        fullWidth
        multiline
        rows={6}
        placeholder="Type your achievements and responsibilities here."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Box display="flex" gap={1} mt={1}>
        <Tooltip title="Bold">
          <IconButton size="small" onClick={() => applyFormat("**", "**")}>
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton size="small" onClick={() => applyFormat("*", "*")}>
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton size="small" onClick={() => applyFormat("<u>", "</u>")}>
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bullet List">
          <IconButton size="small" onClick={() => applyFormat("\n- ", "")}>
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Insert Link">
          <IconButton
            size="small"
            onClick={() => applyFormat("[", "](https://)")}
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Undo">
          <IconButton size="small" onClick={undo}>
            <UndoIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Redo">
          <IconButton size="small" onClick={redo}>
            <RedoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default RichTextEditor;*/}
