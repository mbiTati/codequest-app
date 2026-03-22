import java.sql.*;
import java.util.ArrayList;

/**
 * Catalogue d'inventions avec JDBC MySQL.
 * CORRECTION M13.
 * 
 * @author CodeQuest
 */

class ConnexionDB {
    private static final String URL = "jdbc:mysql://localhost:3306/labo_inventions";
    private static final String USER = "root";
    private static final String PASS = "";

    /**
     * Retourne une connexion a la base MySQL.
     * @return Connection active
     * @throws SQLException si connexion impossible
     */
    public static Connection getConnexion() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}

class InventionDAO {
    private Connection conn;

    public InventionDAO(Connection conn) {
        this.conn = conn;
    }

    /**
     * Recupere toutes les inventions triees par annee.
     */
    public ArrayList<String> getTout() throws SQLException {
        ArrayList<String> liste = new ArrayList<>();
        String sql = "SELECT * FROM inventions ORDER BY annee";
        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                int id = rs.getInt("id");
                String nom = rs.getString("nom");
                int annee = rs.getInt("annee");
                String inventeur = rs.getString("inventeur");
                liste.add("[" + id + "] " + nom + " (" + annee + ") par " + inventeur);
            }
        }
        return liste;
    }

    /**
     * Ajoute une invention.
     */
    public void ajouter(String nom, int annee, String inventeur) throws SQLException {
        String sql = "INSERT INTO inventions (nom, annee, inventeur) VALUES (?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, nom);
            ps.setInt(2, annee);
            ps.setString(3, inventeur);
            ps.executeUpdate();
        }
    }

    /**
     * Supprime une invention par son id.
     */
    public void supprimer(int id) throws SQLException {
        String sql = "DELETE FROM inventions WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            int rows = ps.executeUpdate();
            if (rows == 0) {
                System.out.println("Attention : aucune invention avec id=" + id);
            }
        }
    }

    /**
     * Recherche les inventions contenant le mot-cle dans le nom.
     */
    public ArrayList<String> rechercher(String motCle) throws SQLException {
        ArrayList<String> resultats = new ArrayList<>();
        String sql = "SELECT * FROM inventions WHERE nom LIKE ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, "%" + motCle + "%");
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    resultats.add(rs.getString("nom") + " (" + rs.getInt("annee") + ")");
                }
            }
        }
        return resultats;
    }

    /**
     * Compte le nombre total d'inventions.
     */
    public int compter() throws SQLException {
        String sql = "SELECT COUNT(*) FROM inventions";
        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }
}

public class LaboJDBC_CORRECTION {
    public static void main(String[] args) {
        try (Connection conn = ConnexionDB.getConnexion()) {
            System.out.println("Connecte a MySQL !");
            InventionDAO dao = new InventionDAO(conn);

            // Lister tout
            System.out.println("=== Toutes les inventions ===");
            for (String inv : dao.getTout()) {
                System.out.println("  " + inv);
            }

            // Ajouter
            dao.ajouter("Machine a vapeur", 1712, "Newcomen");
            System.out.println("\nAjoutee ! Total : " + dao.compter());

            // Rechercher
            System.out.println("\n=== Recherche 'phone' ===");
            for (String inv : dao.rechercher("phone")) {
                System.out.println("  " + inv);
            }

            // Lister a nouveau
            System.out.println("\n=== Liste mise a jour ===");
            for (String inv : dao.getTout()) {
                System.out.println("  " + inv);
            }

        } catch (SQLException e) {
            System.out.println("Erreur DB : " + e.getMessage());
            System.out.println("Verifiez : MySQL lance ? Base 'labo_inventions' creee ? mysql-connector-j.jar dans Build Path ?");
        }
    }
}
