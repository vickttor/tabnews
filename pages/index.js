export default function Home() {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100dvw",
      height: "100dvh",
      overflowX: "hidden",
    }}>
      <h1 style={{ textAlign: "center" }}>🌐 Tabnews Clone - Under Development 🔩 🚧</h1>
      <span stye={{ color: "#970DC9" }}>Learning and coding to get a better life.</span>
      <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script>

      <dotlottie-player
        src="https://lottie.host/085ca238-4e03-4ed6-8093-09176802abc8/9qf86bKypT.json"
        background="transparent"
        speed="2"
        style={{
          width: "300px",
          height: "300px",
        }}
        loop
        autoplay
      ></dotlottie-player>

      <footer>
        <span>&copy; Made by </span>
        <a target="_blank" href="https://github.com/vickttor">vickttor</a>
      </footer>
    </main>
  )
}
