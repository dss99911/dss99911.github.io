import Foundation
import Security


func main() {
    if !isRunningAsRoot() {
        print("Sudo is required")
        exit(1)
    }
    if CommandLine.argc != 3 {
        print("Usage: \(CommandLine.arguments[0]) <account> <service>")
        exit(1)
    }

    let account = CommandLine.arguments[1]
    let service = CommandLine.arguments[2]

    if let password = getPasswordFromKeychain(account: account, service: service) {
        print(password)
    } else {
        print("Failed to retrieve password.")
        exit(1)
    }

}

func getPasswordFromKeychain(account: String, service: String) -> String? {
    let query: [CFString: Any] = [
        kSecClass: kSecClassGenericPassword,
        kSecAttrAccount: account,
        kSecAttrService: service,
        kSecReturnData: true
    ]

    var item: CFTypeRef?
    let status = SecItemCopyMatching(query as CFDictionary, &item)

    guard status == errSecSuccess else {
        print("Error retrieving password: \(status)")
        return nil
    }

    if let passwordData = item as? Data,
       let password = String(data: passwordData, encoding: .utf8) {
        return password
    }

    return nil
}

func isRunningAsRoot() -> Bool {
    return geteuid() == 0
}


main()
