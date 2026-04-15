import { useRef, useEffect } from 'react'; //built/in Hooks
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';

// useRef creates a mutable reference object that persists
// across componenet re/rerenders 
// without triggering updates when its value changes.
// 
// UseEffect is a hook that allows you to perform 
// side effects in function components.
// It takes a function as an argument and runs 
// that function after the component renders.
// You can also specify dependencies for the effect, 
// so it only runs when those dependencies change.    

const tabs = ['Currently','Today', 'Weekly'];

export default function MiddleArea({ activeTab, setActiveTab, extraText }) {

    const scrollRef = useRef(null); //  a variable that later point to my scrollview component
    // react stores it inside scrollRef.current
    // and I can use it to call methods on the scrollview
    // it will persist across re/renders and will not cause re/renders when it changes
// we need it because
// when the user taps Todat the middle area
// needs to move to the Today page
// and that means I need a direct handle to the scrollView
// refs are the standard way to access a scrollable componenet
// and call methods like scrollTo()


// useEffect = lets us run some code after the component renders
// useRef = lets us create a reference to a component that persists across renders


    const { width } = useWindowDimensions(); // get the width of the screen to make each page the correct width

// this runs when activeTab changes
    useEffect(() => {
        const index = tabs.indexOf(activeTab);
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ x: index * width, animated: true });
        }
    }, [activeTab, width]); // move scrollView to the correct page whenever activeTab change
    // so we are moving scrollView ot the correct tab
// THE EFFECT USES WIDTH AS A DEPENDENCY BECAUSE IF THE SCREEN SIZE CHANGES, WE ALSO WANT TO UPDATE THE SCROLL POSITION TO THE CORRECT PAGE

    // this runs when the user scrolls the middle area
    const handleScroll = (event) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollX / width);
        setActiveTab(tabs[index]);
    };

    // this runs when the user stops scrolling the middle area
    const handleScrollEnd = (event) => {
        const scrollX = event.nativeEvent.contentOffset.x; // get how far the user has scrolled horizontally
        const index = Math.round(scrollX / width);
        setActiveTab(tabs[index]);
    }

    // this is a helper function to get the text to display in the middle of the page
    const getDisplayText = (tabName) => {
        return extraText ? `${tabName} ${extraText}` : tabName; 

    }

// when this scrollView exists, put it in my box and make it scrollable horizontally and snap to page
// noW scrollRef.current will point to the actual scrollView component, and I can call methods on it like scrollTo() to move it aroun

    return (
       <ScrollView 
        ref={scrollRef} // connects to reference variable
        horizontal={true} pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd} // when the user stops scrolling, update activeTab 
        style={styles.scrollView}
       >
        {/* one page for each tab */}
        {tabs.map((tab) => (
            <View key={tab} style={[styles.page, { width: width }]}>
                <Text style={styles.pageText}>
                    {getDisplayText(tab)}
                </Text>
            </View>
        ))}
       </ScrollView> 
    );
}

const styles = StyleSheet.create ({
    //middle area takes up all the space between top and bottom bar, 
    // so flex 1
    scrollView: {
        flex: 1,
    },

    // each page is one screen wide
    page: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },

    // big text in the middle of the page
    pageText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },

});

// TO DO FINISH RESPONSIVENESS 

// useEffect means 'after the component renders, run this code'
// a hook for doing something after render
// we have two ways to change tabs
// tap bottom button
// swipe the middle area
// if the user taps the button, activeTab changes first,
// then useEffect notices that change and uses the scrollView to slide
// to the correct page
// if the user swipes, the scrollView changes first, 
// then we have to listen to that change and update activeTab
// so we have to listen to scroll event and update activeTab accordingly