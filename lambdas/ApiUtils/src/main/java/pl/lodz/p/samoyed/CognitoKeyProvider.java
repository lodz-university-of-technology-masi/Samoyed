package pl.lodz.p.samoyed;

import com.auth0.jwk.Jwk;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import com.auth0.jwt.interfaces.RSAKeyProvider;

import java.net.URL;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

public class CognitoKeyProvider implements RSAKeyProvider {

    private URL url;

    public CognitoKeyProvider(String url) {
        try {
            this.url = new URL(url);
        } catch (Exception ex) {
            //
        }
    }

    @Override
    public RSAPublicKey getPublicKeyById(String kid) {
        try {
            JwkProvider provider = new JwkProviderBuilder(url).build();
            Jwk jwk = provider.get(kid);
            return (RSAPublicKey) jwk.getPublicKey();
        } catch (Exception ex) {
            return null;
        }
    }

    @Override
    public RSAPrivateKey getPrivateKey() {
        return null;
    }

    @Override
    public String getPrivateKeyId() {
        return null;
    }

}
