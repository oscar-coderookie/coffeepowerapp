import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Dimensions } from 'react-native';
import videoBack from '../assets/images/home-movil.mp4';


const { width } = Dimensions.get("window");

export default function VideoPlayer() {
    const player = useVideoPlayer(videoBack, player => {
        player.loop = true;
        player.play();
    });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    return (
        <View style={styles.contentContainer}>
            <VideoView resizeMo nativeControls={false} style={styles.video} player={player} allowsPictureInPicture />
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
    },
    video: {
        width: width, // ancho de pantalla
        aspectRatio: 5 / 9,
    }
});
