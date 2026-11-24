import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
   if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }
    self.moduleName = "FougitoDeliver"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    // iOS 27 SDK requires the UIScene lifecycle: the window is created in SceneDelegate.
    self.automaticallyLoadReactNativeWindow = false

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

// UIScene lifecycle (required for apps built with the iOS 27 SDK).
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    guard let windowScene = scene as? UIWindowScene,
          let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }

    let rootView = appDelegate.rootViewFactory.view(
      withModuleName: appDelegate.moduleName ?? "FougitoDeliver",
      initialProperties: appDelegate.initialProps,
      launchOptions: nil
    )
    let rootViewController = WindowControlsAwareViewController()
    appDelegate.setRootView(rootView, toRootViewController: rootViewController)

    let window = UIWindow(windowScene: windowScene)
    window.rootViewController = rootViewController
    self.window = window
    appDelegate.window = window
    window.makeKeyAndVisible()
  }

  func windowScene(_ windowScene: UIWindowScene, didUpdate previousCoordinateSpace: UICoordinateSpace, interfaceOrientation previousInterfaceOrientation: UIInterfaceOrientation, traitCollection previousTraitCollection: UITraitCollection) {
    NotificationCenter.default.post(name: Notification.Name("RCTWindowFrameDidChangeNotification"), object: self)
  }
}

// iPadOS 26+ windowed mode: the close/minimise buttons sit in the top-left corner
// but are not part of the normal safe area. Extend the safe area so React Native
// content (logo, back buttons) is laid out below them. No effect on iPhone.
class WindowControlsAwareViewController: UIViewController {
  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    guard #available(iOS 26.0, *) else { return }
    let cornerTop = view.edgeInsets(for: .safeArea(cornerAdaptation: .vertical)).top
    let baseTop = view.safeAreaInsets.top - additionalSafeAreaInsets.top
    let extra = max(0, cornerTop - baseTop)
    if abs(additionalSafeAreaInsets.top - extra) > 0.5 {
      additionalSafeAreaInsets.top = extra
    }
  }
}
