const COMMANDS = {
  // List links
  ls: {
    func: joinWriter(list, listWriter),
  },
  // Open a link
  open: {
    func: joinWriter(open_link, writer),
  },
  // Add a link
  add: {
    func: joinWriter(add, writer),
  },
  // Delete a link
  del: {
    func: joinWriter(del, writer),
  },
  // search with ddg or google
  search: {
    func: joinWriter(search, writer),
  },
  // change theme
  theme: {
    func: joinWriter(theme, writer),
  },
  // list themes
  themes: {
    func: joinWriter(themes, themeWriter),
  },
  // help
  help: {
    func: joinWriter(command, errorWriter),
  },
  // clear
  clear: {
    func: joinWriter(command, clearWriter),
  },
};

let searchUrl = ENGINES.ddg; // default search engine
let links = {};
let position = []; // Determines where in the link tree we are currently

function handleKeyPresses(e) {
  if (e.keyCode === 13) {
    // Enter
    const input = document.getElementById("prompt-input");
    return runCommand(input.value);
  }
}

function runCommand(cmd) {
  const parsedCmd = parseCommand(cmd);
  let response;
  let prompt = document.getElementById("prompt");

  try {
    response = COMMANDS[parsedCmd[0]].func(
      parsedCmd.slice(1, parsedCmd.length)
    );
  }

  // Handling errors

  catch (err) {

    const terminal = document.getElementById("links");
    const outputNode = document.createElement("div");
    outputNode.classList.add("ls");
    let inner = "<ul class='ls-links'>";

    inner += `<h3 class='purple'> Unknown command: ${parsedCmd[0]}</h3>`;
    COMM.forEach(add);

    function add(item) {
      inner += `<li class="ls-item"><span class="material-icons md-36">arrow_right_alt</span>${item.name} - ${item.description}</li>`;
    }

    inner = inner + "</ul>";
    outputNode.innerHTML = inner;
    document.getElementById("links").innerHTML = "";
    terminal.appendChild(outputNode);

  }

  clearPrompt();
  prompt.innerHTML =
    `<span class="purple material-icons md-36">chevron_right</span>
    ${parsedCmd[0]}
    <span id=clock></span>`;
}

(() => {

  const lsLinks = readLinks();
  if (lsLinks) {
    links = lsLinks;
  }

  const savedEngine = readEngine();
  if (savedEngine) {
    searchUrl = savedEngine;
  }

  const currentTheme = readTheme();
  theme([currentTheme]);

  document.addEventListener("keydown", handleKeyPresses);
  fastList();

})();
